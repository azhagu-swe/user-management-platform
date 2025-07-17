// src/features/permission-management/components/PermissionFormModal.tsx
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
  Box,
  // FormHelperText,
  // Grid, // For layout if needed
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Permission, PermissionFormData } from '../types/permissionTypes';
import { createPermission, updatePermission } from '../services/permissionService';
import { useSnackbar } from '@/hooks/useSnackbar';

interface PermissionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void; // To trigger re-fetch on parent page
  permission?: Permission | null; // Permission object for editing, null/undefined for creating
}

interface FormErrors {
  name?: string;
  description?: string;
}

export default function PermissionFormModal({
  open,
  onClose,
  onSave,
  permission,
}: PermissionFormModalProps) {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<PermissionFormData>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) { // Reset form when modal opens or permission prop changes
      if (permission) {
        setFormData({
          name: permission.name,
          description: permission.description || '',
        });
      } else {
        setFormData({ name: '', description: '' }); // Reset for new permission
      }
      setErrors({}); // Clear errors
    }
  }, [permission, open]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Permission name is required.';
    } else if (formData.name.trim().length < 3 || formData.name.trim().length > 100) {
      // Matching backend @Size validation for name
      newErrors.name = 'Permission name must be between 3 and 100 characters.';
    }

    if (formData.description && formData.description.trim().length > 255) {
      // Matching backend @Size validation for description
      newErrors.description = 'Description cannot exceed 255 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (permission && permission.id) { // Editing existing permission
        const updatedPermission = await updatePermission(permission.id, formData);
        showSnackbar(`Permission "${updatedPermission.name}" updated successfully.`, 'success');
      } else { // Creating new permission
        const newPermission = await createPermission(formData);
        showSnackbar(`Permission "${newPermission.name}" created successfully.`, 'success');
      }
      onSave(); // Trigger re-fetch in parent
      onClose(); // Close modal
    } catch (error) {
      showSnackbar((error as Error).message || 'Failed to save permission.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
  };

  return (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSubmit();
            },
        }}
        aria-labelledby="permission-form-dialog-title"
    >
      <DialogTitle id="permission-form-dialog-title">
        {permission ? 'Edit Permission' : 'Create New Permission'}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}> {/* Added pt for spacing after title */}
        <Box > {/* Removed component="form" from here */}
          <TextField
            margin="dense" // Changed from normal for tighter spacing in dialog
            required
            fullWidth
            id="permissionName"
            label="Permission Name"
            name="name" // Should match key in formData
            autoComplete="off"
            autoFocus
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
            inputProps={{ maxLength: 100 }} // Corresponds to backend length
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            fullWidth
            id="permissionDescription"
            label="Description (Optional)"
            name="description" // Should match key in formData
            autoComplete="off"
            multiline
            rows={3} // Adjust rows as needed
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isLoading}
            inputProps={{ maxLength: 255 }} // Corresponds to backend length
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit" // This will now submit the Dialog's form
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Saving...' : (permission ? 'Save Changes' : 'Create Permission')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
