// src/providers/AuthProvider.tsx
'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  callSigninApi,
  callSignupApi,
  callRequestPasswordResetApi,
  callResetPasswordApi,
  callSignoutApi, // <-- Import the new service function
} from '@/features/authentication/services/auth';
import {
  AuthResponseData,
  LoginRequestPayload,
  SignupRequestPayload,
  ResetPasswordPayload,
  // MessageResponseData, // Might not be directly used by AuthProvider state for logout
} from '@/features/authentication/types/auth';
// import axiosInstance from '@/lib/axiosInstance'; // No longer directly needed for logout API call here
import { UserInfo } from '@/types';
import {
  ACCESS_TOKEN_KEY,
  PUBLIC_AUTH_ROUTES,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
} from '@/features/authentication/utils/constants';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { setCookie, removeCookie } from '@/lib/cookies';
import axios from 'axios';
import { ChangePasswordFormData } from '@/features/user-management/types/userTypes';
import { changeUserPassword } from '@/features/user-management/services/userService';


const MIDDLEWARE_AUTH_COOKIE_NAME = 'your-auth-token-cookie-name';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... (useState for user, isAuthenticated, isLoading, isInitializing, error remains the same)
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // This will be used by login, signup, logout etc.
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const clearClientSession = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    removeCookie(MIDDLEWARE_AUTH_COOKIE_NAME);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const setUserSession = useCallback(
    (authData: AuthResponseData, rememberMe?: boolean) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      }
      const currentUserData: UserInfo = {
        id: authData.id,
        username: authData.username,
        email: authData.email,
        role: authData.roles?.[0] || 'user',
        permissions: authData.permissions || [],
      };
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(currentUserData));
      setUser(currentUserData);
      setIsAuthenticated(true);
      const cookieExpiryDays = rememberMe ? 30 : 1;
      setCookie(
        MIDDLEWARE_AUTH_COOKIE_NAME,
        authData.accessToken,
        cookieExpiryDays
      );
    },
    []
  );

  // --- MODIFIED LOGOUT FUNCTION ---
  const signout = useCallback(
    async (options?: { preventRedirect?: boolean }) => {
      const currentPathname = pathname;
      // console.log('AuthProvider: Logging out user...');

      // Retrieve refresh token from localStorage to send to backend
      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem(REFRESH_TOKEN_KEY)
          : null;

      // Optimistically clear client session first for faster UI update
      // clearClientSession();
      // setError(null); // Clear any existing errors
      // Don't set isLoading here, as callLogoutApi will handle its own loading if needed,
      // or we can set it if we want a global loading state for logout action.
      // For now, let's assume callLogoutApi doesn't need a global isLoading.

      try {
        await callSignoutApi(refreshToken); // Call the new service function
        // console.log('AuthProvider: Backend logout successful.');
      } catch (logoutServiceError: unknown) {
        // The service function already logs detailed errors.
        // We might set a generic error state here if needed, but often for logout,
        // even if the backend call fails, we proceed with client-side cleanup.
        console.error(
          'AuthProvider: Error during backend logout:',
          (logoutServiceError as Error).message
        );
        // setError((logoutServiceError as Error).message || 'Logout failed on server.'); // Optional: set error state
      } finally {
        // STEP 2: Clean up the client session artifacts.
        // This 'finally' block *always* runs after the 'try...catch' is finished.
        clearClientSession();
        setError(null);
        setIsLoading(false); // Reset any loading indicators

        // STEP 3: Handle redirection after all cleanup is done.
        if (!options?.preventRedirect) {
          if (!PUBLIC_AUTH_ROUTES.includes(currentPathname)) {
            router.push(PUBLIC_AUTH_ROUTES[0] || '/auth/signin');
          }
        }
      }
    },
    [router, pathname, clearClientSession]
  );
  const updateUserContext = useCallback(
    (updatedUserData: Partial<UserInfo>) => {
      setUser((prevUser) => {
        if (!prevUser) return null; // Should not happen if this function is called

        const newUser = { ...prevUser, ...updatedUserData };

        try {
          // Also update the user info in localStorage
          localStorage.setItem(USER_INFO_KEY, JSON.stringify(newUser));
        } catch (error) {
          console.error('Failed to update user info in localStorage', error);
        }

        return newUser;
      });
    },
    []
  );

  useEffect(() => {
    setIsInitializing(true);
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUserJson = localStorage.getItem(USER_INFO_KEY);
      if (storedToken && storedUserJson) {
        const storedUser: UserInfo = JSON.parse(storedUserJson);
        setUser(storedUser);
        setIsAuthenticated(true);
        setCookie(MIDDLEWARE_AUTH_COOKIE_NAME, storedToken, 1);
      } else {
        clearClientSession();
      }
    } catch (e: unknown) {
      console.log(e as Error);
      clearClientSession();
    } finally {
      setIsInitializing(false);
    }
  }, [clearClientSession]);

  useEffect(() => {
    const handleSessionExpired = () => {
      signout({ preventRedirect: PUBLIC_AUTH_ROUTES.includes(pathname) });
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('sessionExpired', handleSessionExpired);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sessionExpired', handleSessionExpired);
      }
    };
  }, [signout, pathname]);

  const signin = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const loginPayload: LoginRequestPayload = { email, password };
    try {
      const authData: AuthResponseData = await callSigninApi(loginPayload);
      setUserSession(authData, rememberMe);
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = (err.response?.data).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
      clearClientSession();
      return false;
    }
  };

  const signup = async (payload: SignupRequestPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming callSignupApi returns MessageResponseData, but AuthProvider doesn't directly use its content
      await callSignupApi(payload);
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Sign up failed. Please try again.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = (err.response?.data).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await callRequestPasswordResetApi(email);
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Could not process request. Please try again later.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = (err.response?.data).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await callResetPasswordApi(payload);
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      let errorMessage =
        'Failed to reset password. The link may be invalid or expired.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = (err.response?.data).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);
const changePassword = async (payload: Omit<ChangePasswordFormData, 'confirmPassword'>): Promise<boolean> => {
  setIsLoading(true); // Use the global loading state
  setError(null);
  try {
    await changeUserPassword(payload);
    setIsLoading(false);
    return true; // Return true on success
  } catch (err: unknown) {
    let errorMessage = 'Failed to change password. Please check your current password and try again.';
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      errorMessage = (err.response?.data).message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    setError(errorMessage); // Set the global error state
    setIsLoading(false);
    return false;
  }
};

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    signin,
    signout,
    isLoading,
    isInitializing,
    error,
    clearError,
    signup,
    requestPasswordReset,
    resetPassword,
    updateUserContext, // <-- Add to the provided context value
    changePassword
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
