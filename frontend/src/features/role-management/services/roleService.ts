// src/features/role-management/services/roleService.ts
import axios, { AxiosError } from 'axios'; // Import AxiosError for type checking
import axiosInstance from '@/lib/axiosInstance';
import {
  Role,
  RoleFormData,
  PaginatedRolesResponse,
  Permission,
} from '../types/roleTypes';
import { BackendApiResponse,BackendErrorPayload, PaginatedResponse } from '@/types'; // Assuming BackendErrorPayload is also in your global types

// IMPORTANT: Ensure these paths correctly map to your backend controllers
// when combined with axiosInstance.baseURL.
// If RoleController is @RequestMapping("/v1/api/roles"), use that.
const API_BASE_URL = 'roles'; // Example: Assuming v1/api prefix
const PERMISSIONS_API_URL = 'permissions'; // Example: Assuming v1/api prefix

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

// Fetch all roles with pagination
export const getAllRoles = async (
  page: number,
  size: number,
  sort?: string // e.g., "name,asc"
): Promise<PaginatedRolesResponse> => {
  const params: Record<string, string | number> = { page, size }; // More specific type for params
  if (sort) {
    params.sort = sort;
  }
  try {
    const response = await axiosInstance.get<BackendApiResponse<PaginatedRolesResponse>>(
     `${API_BASE_URL}/list`,
      { params }
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded success but data is invalid for roles.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch roles. Please try again.');
  }
};

// Fetch a single role by ID
export const getRoleById = async (id: number): Promise<Role> => {
  try {
    const response = await axiosInstance.get<BackendApiResponse<Role>>(
      `${API_BASE_URL}/${id}`
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Server responded success but data is invalid for role ID ${id}.`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to fetch role with ID ${id}. Please try again.`);
  }
};

// Create a new role
export const createRole = async (roleData: RoleFormData): Promise<Role> => {
  try {
    const response = await axiosInstance.post<BackendApiResponse<Role>>(
      API_BASE_URL,
      roleData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded success but data is invalid for created role.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to create role. Please try again.');
  }
};

// Update an existing role
export const updateRole = async (
  id: number,
  roleData: RoleFormData
): Promise<Role> => {
  try {
    const response = await axiosInstance.put<BackendApiResponse<Role>>(
      `${API_BASE_URL}/${id}`,
      roleData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Server responded success but data is invalid for updated role ID ${id}.`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to update role with ID ${id}. Please try again.`);
  }
};

// Delete a role
export const deleteRole = async (id: number): Promise<void> => {
  try {
    // Spring Boot returns 204 No Content for successful delete.
    // Axios will treat 204 as success, and response.data will be empty.
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    // No data to return or check for a void successful operation.
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to delete role with ID ${id}. Please try again.`);
  }
};


/**
 * Fetches permissions from the paginated endpoint.
 * This service function handles the pagination and returns a simple array of Permission objects.
 * @returns A promise that resolves with an array of Permission objects.
 */
export const getAllPermissionsSearch = async (): Promise<Permission[]> => {
  try {
    // We fetch with a large page size to get all permissions for form selectors.
    // NOTE: The best long-term solution is a dedicated backend endpoint like '/all'
    // that returns a non-paginated list.
    const params = { page: 0, size: 200 }; // Fetch up to 200 permissions

    // The API response's 'data' property is a PaginatedResponse object
    const response = await axiosInstance.get<BackendApiResponse<PaginatedResponse<Permission>>>(
      PERMISSIONS_API_URL+"/all",
      { params }
    );

    // This check is crucial
    if (response.data.status === 'success' && response.data.data?.content) {
      // --- THE FIX IS HERE ---
      // We return the .content property, which is the Permission[] array.
      return response.data.data.content;
    }

    // If status is 'success' but the data or content is missing, something is wrong with the API response
    throw new Error(response.data.message || 'Server responded successfully but permission data is invalid.');

  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch permissions. Please try again.');
  }
};

/**
 * Fetches a complete, non-paginated list of all roles.
 * Ideal for populating form selectors.
 * @returns A promise that resolves with an array of Role objects.
 */
export const getAllRolesList = async (): Promise<Role[]> => {
  try {
    // Assuming backend endpoint is at /v1/api/roles/all
    const response = await axiosInstance.get<BackendApiResponse<Role[]>>(
       `${API_BASE_URL}/all`
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded success but roles list is invalid.');
  } catch (error: unknown) {
    // For a form selector, it's critical this works. Throwing the error is appropriate.
    throw handleApiError(error, 'Failed to fetch the list of roles.');
  }
};
