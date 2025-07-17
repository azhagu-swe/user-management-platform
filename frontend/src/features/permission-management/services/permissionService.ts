// src/features/permission-management/services/permissionService.ts
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import {
  Permission,
  PermissionFormData,
} from '../types/permissionTypes';
import { BackendApiResponse, BackendErrorPayload, PaginatedResponse } from '@/types'; // Assuming global BackendApiResponse

const API_BASE_URL = 'permissions';

const handleApiError = (error: unknown, defaultMessage: string): Error => {
  let userFriendlyMessage = defaultMessage;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendApiResponse<null> | BackendErrorPayload>;
    if (axiosError.response?.data?.message) {
      userFriendlyMessage = axiosError.response.data.message;
    } else if (axiosError.request) {
      userFriendlyMessage = 'Server is not responding. Please check your network.';
    } else if (error.message) {
      userFriendlyMessage = error.message;
    }
  } else if (error instanceof Error) {
    userFriendlyMessage = error.message;
  }
  console.error('Full API error details for permission service:', error);
  return new Error(userFriendlyMessage);
};

// Fetch all permissions (backend returns List<PermissionResponse>)
export const getAllPermissions = async (
  page: number,
  size: number,
  sort?: string
): Promise<PaginatedResponse<Permission>> => { // <-- Return type is now PaginatedResponse<Permission>
  const params: Record<string, string | number> = { page, size };
  if (sort) {
    params.sort = sort;
  }
  try {
    const response = await axiosInstance.get<BackendApiResponse<PaginatedResponse<Permission>>>( // <-- Expect this shape
       `${API_BASE_URL}/all`,

      { params }
    );
    if (response.data.status === 'success' && response.data.data) {
      // The 'data' field is the paginated object itself
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded successfully but permission data is invalid.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch permissions. Please try again.');
  }
};

// Fetch a single permission by ID
export const getPermissionById = async (id: number): Promise<Permission> => {
  try {
    const response = await axiosInstance.get<BackendApiResponse<Permission>>(
      `${API_BASE_URL}/${id}`
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Server responded success but data is invalid for permission ID ${id}.`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to fetch permission with ID ${id}.`);
  }
};

// Create a new permission
// Backend endpoint is POST /v1/api/permissions/create
export const createPermission = async (permissionData: PermissionFormData): Promise<Permission> => {
  try {
    const response = await axiosInstance.post<BackendApiResponse<Permission>>(
      `${API_BASE_URL}/create`, // Matches your backend controller
      permissionData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Server responded success but data is invalid for created permission.');
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to create permission.');
  }
};

// Update an existing permission
export const updatePermission = async (
  id: number,
  permissionData: PermissionFormData
): Promise<Permission> => {
  try {
    const response = await axiosInstance.put<BackendApiResponse<Permission>>(
      `${API_BASE_URL}/${id}`,
      permissionData
    );
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Server responded success but data is invalid for updated permission ID ${id}.`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to update permission with ID ${id}.`);
  }
};

// Delete a permission
export const deletePermission = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to delete permission with ID ${id}.`);
  }
};