// src/features/role-management/components/RoleFormModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Autocomplete,
  Box,
  FormHelperText,
} from '@mui/material';
import { Role, RoleFormData, Permission } from '../types/roleTypes';
import { createRole, updateRole } from '../services/roleService';
import { useSnackbar } from '@/hooks/useSnackbar';

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  role?: Role | null;
  availablePermissions: Permission[];
}

export default function RoleFormModal({
  open,
  onClose,
  onSave,
  role,
  availablePermissions,
}: RoleFormModalProps) {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; permissions?: string }>({});

  useEffect(() => {
    if (open) { // Reset form only when modal opens or role changes
      if (role) {
        setFormData({
          name: role.name,
          permissions: role.permissions || [],
        });
      } else {
        setFormData({ name: '', permissions: [] });
      }
      setErrors({});
    }
  }, [role, open]); // Rerun effect if role or open status changes

  const validate = (): boolean => {
    const newErrors: { name?: string; permissions?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required.';
    }
    // Optional: if (formData.permissions.length === 0) {
    //   newErrors.permissions = 'At least one permission must be selected.';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (role && role.id) {
        const updatedRole = await updateRole(role.id, formData);
        showSnackbar(`Role "${updatedRole.name}" updated successfully.`, 'success');
      } else {
        const newRole = await createRole(formData);
        showSnackbar(`Role "${newRole.name}" created successfully.`, 'success');
      }
      onSave();
      onClose();
    } catch (error) {
      showSnackbar((error as Error).message || 'Failed to save role.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Correctly typed event and newValue
  const handlePermissionChange = (
    _event: React.SyntheticEvent, // event is available, prefixed with _ if not used
    newValue: Permission[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: newValue.map((p) => p.name),
    }));
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: undefined }));
    }
  };

  const selectedPermissionObjects = availablePermissions.filter(p =>
    formData.permissions.includes(p.name)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form', onSubmit: (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSubmit(); } }}>
      <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
      <DialogContent dividers>
        <Box  sx={{ mt: 1 }}> {/* Removed component="form" from here, put on PaperProps */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="roleName"
            label="Role Name"
            name="roleName"
            autoComplete="off"
            autoFocus
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
          />
          <Autocomplete
            multiple
            id="role-permissions"
            options={availablePermissions}
            getOptionLabel={(option) => option.name}
            value={selectedPermissionObjects}
            onChange={handlePermissionChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            // renderTags prop removed - MUI Autocomplete will render Chips by default for multiple values
            // If you need custom chip appearance, you can use the ChipProps prop
            // or customize Chip component via theme.
            ChipProps={{ variant: "outlined", size: "small" }} // Example: Apply props to default chips
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Permissions"
                placeholder={selectedPermissionObjects.length > 0 ? "" : "Select permissions"} // Hide placeholder if values exist
                margin="normal"
                error={!!errors.permissions}
              />
            )}
            disabled={isLoading}
          />
          {errors.permissions && <FormHelperText error sx={{ ml: '14px' /* Align with TextField text */ }}>{errors.permissions}</FormHelperText>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit" // Ensure this button submits the form (moved form tag to PaperProps)
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Saving...' : (role ? 'Save Changes' : 'Create Role')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}