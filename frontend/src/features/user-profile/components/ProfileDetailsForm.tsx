// src/features/user-profile/components/ProfileDetailsForm.tsx
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
//   alpha,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar';
import { updateUser } from '@/features/user-management/services/userService';
import { UserFormData } from '@/features/user-management/types/userTypes';
import { UserInfo } from '@/types';

// This form will only update a subset of the fields in UserFormData
// We can define a more specific type for this form's data.
type ProfileUpdateFormData = Pick<UserFormData, 'username'> & {
    firstName?: string;
    lastName?: string;
};

type FormErrors = Partial<ProfileUpdateFormData>


export default function ProfileDetailsForm() {
  const { user, updateUserContext } = useAuth();
  const { showSnackbar } = useSnackbar();

  // Initialize form state with empty strings to avoid uncontrolled component warnings
  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    username: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // To track if form has changes

  useEffect(() => {
    // Populate form with user data when component loads or user object changes
    if (user) {
      // Assuming your UserInfo type might not have firstName/lastName directly,
      // we can try to construct them or use fallbacks.
      const nameParts = user.username.split(' '); // A simple fallback
      const initialFirstName = (user as UserInfo & { firstName?: string }).firstName || nameParts[0] || '';
      const initialLastName = (user as UserInfo & { lastName?: string }).lastName || nameParts.slice(1).join(' ') || '';
      
      setFormData({
        username: user.username || '',
        firstName: initialFirstName,
        lastName: initialLastName,
      });
      setIsDirty(false); // Reset dirty state when user data changes
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required.';
    // Add other validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || !user) return;

    setIsSaving(true);
    
    // Construct payload with only the fields this form is responsible for
    const payload: Partial<UserFormData> = {
      username: formData.username,
      // If your backend expects firstName/lastName, ensure your UserFormData type
      // and backend DTO can handle them.
      // For this example, we assume updateUser can take a partial update.
    };

    try {
      const updatedUser = await updateUser(user.id, payload);
      // Update the global context with the new user data returned from the API
      updateUserContext({ 
          username: updatedUser.username,
          // Update other fields if they are part of your UserInfo context type
      });
      showSnackbar('Profile updated successfully!', 'success');
      setIsDirty(false); // Reset dirty state after successful save
    } catch (error) {
      showSnackbar((error as Error).message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" component="h2">
            Profile Information
          </Typography>
          <Grid container spacing={2}>
            {/* --- CORRECTED GRID SYNTAX --- */}
            <Grid size={{sm:6,xs:12}}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isSaving}
              />
            </Grid>
            <Grid size={{sm:6,xs:12}}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isSaving}
              />
            </Grid>
            <Grid size={{sm:6,xs:12}}>
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isSaving}
              />
            </Grid>
            <Grid size={{sm:6,xs:12}}>
              <TextField
                fullWidth
                label="Email Address"
                value={user?.email || ''}
                disabled // Email is usually not updatable from a profile form
                variant="filled" // Use filled variant for disabled fields for better UX
                InputProps={{
                    sx: {
                        color: 'text.disabled',
                    }
                }}
              />
            </Grid>
             {/* --- END OF CORRECTION --- */}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || !isDirty} // Disable if saving or no changes have been made
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
