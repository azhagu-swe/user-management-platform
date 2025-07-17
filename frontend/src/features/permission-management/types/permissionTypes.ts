// src/features/permission-management/types/permissionTypes.ts

// Represents a permission object received from the backend (and displayed)
export interface Permission {
  id: number;       // Changed from Long
  name: string;
  description?: string; // Assuming backend PermissionResponse will include this
  // Add audit fields if you plan to display them (createdAt, updatedAt etc.)
  // createdAt?: string;
  // updatedAt?: string;
}

// Data structure for creating or updating a permission (matches backend PermissionRequest)
export interface PermissionFormData {
  name: string;
  description?: string;
}
