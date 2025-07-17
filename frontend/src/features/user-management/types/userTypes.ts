
// Matches backend UserResponse DTO
export interface User {
  id: string; // From UUID
  username: string;
  email: string;
  roles: string[]; // From Set<String>
}

// Inferred from your backend's likely CreateUserRequest & UpdateUserRequest
// Used for the Create/Edit form
export interface UserFormData {
  username: string;
  email: string;
  password?: string; // Optional for update, required for create
  roleIds: number[]; // Backend likely expects Role IDs
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}