import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import {
  LoginRequestPayload,
  AuthResponseData,
  BackendErrorPayload,
  SignupRequestPayload,
  MessageResponseData,
  ResetPasswordPayload,
  RequestAccessPayload,
} from '@/features/authentication/types/auth';
import { BackendApiResponse } from '@/types';

export const callSigninApi = async (
  loginCredentials: LoginRequestPayload
): Promise<AuthResponseData> => {
  try {
    const response = await axiosInstance.post<
      BackendApiResponse<AuthResponseData>
    >(
      'auth/signin', // Assuming your controller is @RequestMapping("/auth")
      loginCredentials
    );

    if (
      response.data &&
      response.data.status === 'success' &&
      response.data.data
    ) {
      return response.data.data; // This is the AuthResponseData
    } else {
      const errorMessage =
        response.data?.message || 'Login failed: Invalid response from server.';
      console.error(
        'Login API Error (Success Status, Invalid Payload):',
        response.data
      );
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    // Changed 'any' to 'unknown' for better type safety
    let userFriendlyMessage =
      'Login failed. Please check your credentials or try again later.';

    if (axios.isAxiosError(error)) {
      // After this check, 'error' is narrowed down to AxiosError
      const axiosError = error as AxiosError<
        BackendApiResponse<null> | BackendErrorPayload
      >;
      if (axiosError.response && axiosError.response.data) {
        // Use the message from your backend's APIResponse wrapper
        userFriendlyMessage =
          axiosError.response.data.message || userFriendlyMessage;
        // You can also log or use axiosError.response.data.errorCode
        const errorCode = (axiosError.response.data as BackendApiResponse<null>)
          .errorCode;
        if (errorCode) {
          console.error(`API Error Code: ${errorCode}`);
        }
      } else if (axiosError.request) {
        userFriendlyMessage =
          'Could not connect to the server. Please check your network.';
      }
      // If it's an Axios error but doesn't fit above, the default message or Axios's own message might be used.
    } else if (error instanceof Error) {
      // If it's a standard JavaScript Error object (e.g., thrown from the 'else' block above)
      userFriendlyMessage = error.message;
    }
    // For truly unknown errors not caught by the above, the default message persists.

    console.error('Full login error details:', error); // Log the original error for debugging
    throw new Error(userFriendlyMessage); // Re-throw a new error with a user-friendly message
  }
};

/**
 * Calls the backend /auth/signup API endpoint.
 * @param signupData - The user's registration details.
 * @returns A promise that resolves with the MessageResponseData if successful.
 * @throws An error with a message if signup fails.
 */
export const callSignupApi = async (
  signupData: SignupRequestPayload
): Promise<MessageResponseData> => {
  try {
    const response = await axiosInstance.post<
      BackendApiResponse<MessageResponseData>
    >(
      'auth/signup', // Assuming your controller is @RequestMapping("/auth")
      signupData
    );

    if (
      response.data &&
      response.data.status === 'success' &&
      response.data.data
    ) {
      return response.data.data; // This is the MessageResponseData
    } else {
      // Handle cases where status might be "success" but data is missing, or status is "error"
      // This path might also be taken if the backend returns 2xx but with an error structure in the body.
      const errorMessage =
        response.data?.message ||
        'Signup failed: Unexpected response from server.';
      console.error(
        'Signup API Error (Success Status, Invalid Payload or Error in Body):',
        response.data
      );
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    let userFriendlyMessage = 'Signup failed. Please try again later.';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<
        BackendApiResponse<null> | BackendErrorPayload
      >;
      if (axiosError.response && axiosError.response.data) {
        // Use the message from your backend's APIResponse wrapper
        userFriendlyMessage =
          axiosError.response.data.message || userFriendlyMessage;
        const errorCode = (axiosError.response.data as BackendApiResponse<null>)
          .errorCode;
        if (errorCode) {
          console.error(
            `API Error during signup: ${userFriendlyMessage}, Code: ${errorCode}`
          );
        }
      } else if (axiosError.request) {
        userFriendlyMessage =
          'Could not connect to the server for signup. Please check your network.';
      }
    } else if (error instanceof Error) {
      userFriendlyMessage = error.message;
    }

    console.error('Full signup error details:', error);
    throw new Error(userFriendlyMessage);
  }
};
export const callRequestPasswordResetApi = async (
  email: string
): Promise<void> => {
  // Replace '/auth/request-password-reset' with your actual API endpoint
  await axiosInstance.post('auth/request-password-reset', { email });
};
export const callResetPasswordApi = async (
  payload: ResetPasswordPayload
): Promise<void> => {
  // Adjust endpoint and how token is sent based on your backend API
  // Example 1: Token in URL, password in body (if your backend is like /auth/reset-password/:token)
  // await axiosInstance.post(`/auth/reset-password/${payload.token}`, { newPassword: payload.newPassword });

  // Example 2: Token and password in body
  await axiosInstance.post('auth/reset-password', payload);
};
export const callValidateResetTokenApi = async (
  token: string
): Promise<void> => {
  // Replace '/auth/validate-reset-token' with your actual backend endpoint.
  // This endpoint should accept the token (e.g., in the URL path or as a query param)
  // and return a success (e.g., 200 OK) if valid, or an error (e.g., 400, 404) if invalid.
  await axiosInstance.get(`auth/validate-reset-token/${token}`); // Example: token as path param
  // Or: await axiosInstance.post('/auth/validate-reset-token', { token });
};

export const callRequestAccessApi = async (
  payload: RequestAccessPayload
): Promise<void> => {
  // Replace '/request-access' with your actual API endpoint
  await axiosInstance.post('auth/request-access', payload);
};

/**
 * Calls the backend /auth/logout API endpoint.
 * @param refreshToken - The user's refresh token (optional, but recommended if backend uses it for invalidation).
 * @returns A promise that resolves with MessageResponseData if successful.
 * @throws An error with a message if logout fails.
 */
export const callSignoutApi = async (
  refreshToken?: string | null // Make it optional if backend doesn't always require it
): Promise<MessageResponseData> => {
  try {
    const payload = refreshToken ? { refreshToken } : {};
    
    const response = await axiosInstance.post<
      BackendApiResponse<MessageResponseData>
    >(
      'auth/logout', 
      payload // Send refreshToken if available
    );

    if (
      response.data &&
      response.data.status === 'success' &&
      response.data.data // data might be a simple message for logout
    ) {
      return response.data.data; // This is the MessageResponseData
    } else {
      const errorMessage =
        response.data?.message || 'Logout failed: Invalid response from server.';
      console.error(
        'Logout API Error (Success Status, Invalid Payload or Error in Body):',
        response.data
      );
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    let userFriendlyMessage = 'Logout failed. Please try again later.';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<
        BackendApiResponse<null> | BackendErrorPayload
      >;
      if (axiosError.response && axiosError.response.data) {
        userFriendlyMessage =
          axiosError.response.data.message || userFriendlyMessage;
        const errorCode = (axiosError.response.data as BackendApiResponse<null>)
          .errorCode;
        if (errorCode) {
          console.error(
            `API Error during logout: ${userFriendlyMessage}, Code: ${errorCode}`
          );
        }
      } else if (axiosError.request) {
        userFriendlyMessage =
          'Could not connect to the server for logout. Please check your network.';
      }
    } else if (error instanceof Error) {
      userFriendlyMessage = error.message;
    }

    console.error('Full logout error details:', error);
    throw new Error(userFriendlyMessage);
  }
};
