import { BackendApiResponse } from "@/types";

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
  type?: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions?: string[];
  themePreferences?: {
    primaryMain?: string;
    secondaryMain?: string;
    backgroundDefault?: string;
    backgroundPaper?: string;
    textPrimary?: string;
    textSecondary?: string;
  } | null; // Optional, can be null if not set

}



export interface BackendErrorPayload {
  status: 'error';
  message: string;
  data: null;
  errorCode?: string | null;
}

export type LoginApiSuccessResponse = BackendApiResponse<AuthResponseData>;

export type LoginApiErrorResponse = BackendApiResponse<null>;

// export interface SignupRequestPayload {
//   username: string;
//   email: string;
//   password: string;
//   role?: string;
// }

export interface MessageResponseData {
  message: string;
}

export type SignupApiSuccessResponse = BackendApiResponse<MessageResponseData>;

export interface SignupRequestPayload {
  fullName?: string;
  firstName:string;
  lastName: string;
  username: string; // Optional
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface RequestAccessPayload {
  fullName: string;
  companyName: string;
  companyEmail: string;
  linkedInUrl?: string; // Optional
  phoneNumber: string; // Full phone number string from mui-tel-input
  countryCode?: string; // From mui-tel-input info
}
