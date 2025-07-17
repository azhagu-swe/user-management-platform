// src/features/user-management/components/UserFormModal.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  FormHelperText,
  Autocomplete,
  Grid,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { User, UserFormData } from '../types/userTypes';
import { Role } from '@/features/role-management/types/roleTypes';
import { createUser, updateUser } from '../services/userService';
import { useSnackbar } from '@/hooks/useSnackbar';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  user?: User | null; // User object for editing, null/undefined for creating
  availableRoles: Role[];
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  roleIds?: string;
}

export default function UserFormModal({
  open,
  onClose,
  onSave,
  user,
  availableRoles,
}: UserFormModalProps) {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    roleIds: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = !!user;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        // Map incoming user.roles (string names) to their corresponding IDs
        const currentRoleIds = availableRoles
          .filter(role => user.roles.includes(role.name))
          .map(role => role.id);
        
        setFormData({
          username: user.username,
          email: user.email,
          password: '', // Password field should be empty for editing for security
          roleIds: currentRoleIds,
        });
      } else {
        // Reset for new user
        setFormData({ username: '', email: '', password: '', roleIds: [] });
      }
      setErrors({}); // Clear errors when modal opens or user prop changes
    }
  }, [user, open, isEditing, availableRoles]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address.';
    
    // Password is only required when creating a new user
    if (!isEditing && !formData.password) {
      newErrors.password = 'Password is required for new users.';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.roleIds.length === 0) {
      newErrors.roleIds = 'At least one role must be assigned.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    const payload = { ...formData };
    // Don't send an empty password field during an update
    if (isEditing && !payload.password) {
      delete payload.password;
    }

    try {
      if (isEditing && user.id) {
        const updatedUser = await updateUser(user.id, payload);
        showSnackbar(`User "${updatedUser.username}" updated successfully.`, 'success');
      } else {
        const newUser = await createUser(payload);
        showSnackbar(`User "${newUser.username}" created successfully.`, 'success');
      }
      onSave(); // Trigger re-fetch in parent
      onClose(); // Close modal
    } catch (error) {
      showSnackbar((error as Error).message || 'Failed to save user.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
  };

  const handleRolesChange = (_event: React.SyntheticEvent, newValue: Role[]) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: newValue.map((role) => role.id),
    }));
    if (errors.roleIds) {
        setErrors(prev => ({...prev, roleIds: undefined}));
    }
  };
  
  // Find the full Role objects for the Autocomplete value prop
  const selectedRoleObjects = useMemo(() => 
    availableRoles.filter(role => formData.roleIds.includes(role.id)),
    [availableRoles, formData.roleIds]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form', onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSubmit(); } }}>
      <DialogTitle>{isEditing ? `Edit User: ${user.username}` : 'Create New User'}</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Box >
          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                margin="dense"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="off"
                autoFocus
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isLoading}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                margin="dense"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                margin="dense"
                required={!isEditing} // Required only on create
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password || (isEditing ? 'Leave blank to keep current password.' : '')}
                disabled={isLoading}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Autocomplete
                multiple
                id="user-roles"
                options={availableRoles}
                getOptionLabel={(option) => option.name}
                value={selectedRoleObjects}
                onChange={handleRolesChange}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={isLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    variant="outlined"
                    label="Roles"
                    placeholder={selectedRoleObjects.length > 0 ? "" : "Assign roles"}
                    error={!!errors.roleIds}
                  />
                )}
              />
              {errors.roleIds && <FormHelperText error sx={{ ml: '14px' }}>{errors.roleIds}</FormHelperText>}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create User')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
