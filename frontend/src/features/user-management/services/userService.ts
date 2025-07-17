// src/features/user-management/services/userService.ts
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { ChangePasswordFormData, User, UserFormData } from '../types/userTypes';
import { BackendApiResponse, BackendErrorPayload, PaginatedResponse } from '@/types';

// IMPORTANT: Ensure this path correctly maps to your backend UserController
const API_BASE_URL = '/users';

const handleApiError = (error: unknown, defaultMessage: string): Error => {
  let userFriendlyMessage = defaultMessage;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendApiResponse<null> | BackendErrorPayload>;
    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
      userFriendlyMessage = axiosError.response.data.message;
      const errorCode = (axiosError.response.data as BackendApiResponse<null>).errorCode;
      if (errorCode) {
        console.error(`API Error (Code: ${errorCode}): ${userFriendlyMessage}`);
      }
    } else if (axiosError.request) {
      userFriendlyMessage = 'Could not connect to the server. Please check your network.';
    } else if (axiosError.message) {
      // For other Axios errors (e.g., setup issues)
      userFriendlyMessage = axiosError.message;
    }
  } else if (error instanceof Error) {
    userFriendlyMessage = error.message;
  }
  // Log the original error for debugging regardless of type
  console.error('Full API error details:', error);
  return new Error(userFriendlyMessage);
};

// Fetch all users with pagination
export const getAllUsers = async (
  page: number,
  size: number,
  sort?: string
): Promise<PaginatedResponse<User>> => {
  const params: Record<string, string | number> = { page, size };
  if (sort) {
    params.sort = sort;
  }
  try {
    const response = await axiosInstance.get<BackendApiResponse<PaginatedResponse<User>>>(
      `${API_BASE_URL}/all`,
      { params }
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded successfully but user data is invalid.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch users.');
  }
};

// Create a new user
export const createUser = async (userData: UserFormData): Promise<User> => {
  try {
    // Note: your backend controller endpoint is '/create'
    const response = await axiosInstance.post<BackendApiResponse<User>>(
      `${API_BASE_URL}/create`,
      userData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create user.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to create user.');
  }
};

// Update an existing user
export const updateUser = async (
  id: string, // Changed to string for UUID
  userData: Partial<UserFormData> // Use Partial as password might not be updated
): Promise<User> => {
  try {
    const response = await axiosInstance.put<BackendApiResponse<User>>(
      `${API_BASE_URL}/${id}`,
      userData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Failed to update user with ID ${id}.`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to update user with ID ${id}.`);
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    // Your backend returns a MessageResponse in the APIResponse wrapper on 200 OK.
    // If it were 204 No Content, we wouldn't expect a body.
    await axiosInstance.delete<BackendApiResponse<unknown>>(`${API_BASE_URL}/${id}`);
    // No data to return, but we can check for success status if needed.
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to delete user with ID ${id}.`);
  }
};

/**
 * Calls the backend endpoint for a logged-in user to change their password.
 * @param payload - The current and new password data.
 */
export const changeUserPassword = async (
  payload: Omit<ChangePasswordFormData, 'confirmPassword'> // Backend probably doesn't need the confirmation field
): Promise<void> => {
  try {
    // This assumes your backend has an endpoint dedicated to changing the password
    // for the currently authenticated user.
    await axiosInstance.post(`${API_BASE_URL}/change-password`, payload);
  } catch (error: unknown) {
    // The handleApiError utility will process and re-throw a user-friendly error
    throw handleApiError(error, 'Failed to change password.');
  }
};