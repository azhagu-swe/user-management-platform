// src/features/user-profile/components/ChangePasswordForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAuth } from '@/hooks/useAuth';
import { ChangePasswordFormData } from '@/features/user-management/types/userTypes';

// Assuming you have a ChangePasswordRequest type that matches your backend
// For this form, we'll use ChangePasswordFormData which includes confirmPassword
type FormErrors = Partial<ChangePasswordFormData>

export default function ChangePasswordForm() {
  const { showSnackbar } = useSnackbar();
  // Get auth functions and state from the central AuthContext
  const { changePassword, isLoading, error: authError, clearError } = useAuth();

  const initialFormState: ChangePasswordFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState<ChangePasswordFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  // Display the error from AuthContext via Snackbar when it changes
  useEffect(() => {
    if (authError) {
      showSnackbar(authError, 'error');
      clearError(); // Clear the error from the context after showing it
    }
  }, [authError, showSnackbar, clearError]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for the field being typed in
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
    // Clear any previous submission error from the context
    if (authError) {
      clearError();
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters.';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password cannot be the same as the current one.';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    // The backend only needs current and new password
    const payload = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    const success = await changePassword(payload);

    if (success) {
      showSnackbar('Password updated successfully!', 'success');
      setFormData(initialFormState); // Reset form on success
      setErrors({});
    }
    // If !success, the useEffect listening to authError will trigger the error snackbar
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, maxWidth: '600px' }}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: {xs: 2, sm: 3} }}>
          <Typography variant="h6" component="h2">
            Change Password
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                required
                type="password"
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                required
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                required
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
