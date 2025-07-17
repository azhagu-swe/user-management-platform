// src/features/role-management/types/roleTypes.ts

// From your backend RoleResponse
export interface Role {
  id: number; // Changed from Long to number for frontend
  name: string;
  permissions: string[]; // Changed from Set<String> to string[] for easier handling
}

// For creating/updating roles (matches backend RoleRequest implicitly)
export interface RoleFormData {
  name: string;
  permissions: string[]; // Set of permission names
}

// For the paginated response from your backend
export interface PaginatedRolesResponse {
  content: Role[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// For individual permission objects (if you fetch a list of all available permissions)
export interface Permission {
  id: number; // Or string, depending on your Permission entity
  name: string;
  description?: string; // Optional
}

// For the backend's APIResponse wrapper
// export interface BackendApiResponse<T> {
//   timestamp: string;
//   status: 'success' | 'error';
//   message: string;
//   data: T | null;
//   errorCode?: string;
//   errors?: Record<string, string> | string[]; // For validation errors
// }