import { createContext } from 'react';
import { UserInfo } from '@/types';
import {
  ResetPasswordPayload,
  SignupRequestPayload,
} from '@/features/authentication/types/auth';
import { ChangePasswordFormData } from '@/features/user-management/types/userTypes';

export interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  signin: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  signout: () => void;
  signup: (payload: SignupRequestPayload) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>; // <-- Add this
  updateUserContext: (updatedUserData: Partial<UserInfo>) => void; // <-- ADD THIS
  changePassword: (payload: Omit<ChangePasswordFormData, 'confirmPassword'>) => Promise<boolean>;

  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
