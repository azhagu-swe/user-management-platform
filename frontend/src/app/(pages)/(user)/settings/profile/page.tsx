// src/app/(app)/settings/profile/page.tsx
'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/features/user-profile/components/ProfileHeader';
import ProfileDetailsForm from '@/features/user-profile/components/ProfileDetailsForm';
import { Box, CircularProgress,  Typography, Stack } from '@mui/material';

export default function ProfileSettingsPage() {
  const { user, isInitializing } = useAuth();
  
  if (isInitializing) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
  }
  
  if (!user) {
      return <Typography sx={{textAlign: 'center', mt: 4}}>User not found. Please sign in.</Typography>
  }

  return (
    <Stack spacing={4}>
        {/* We can re-use the profile header here for a consistent feel */}
        <ProfileHeader user={user} />
        
        {/* Pass the ProfileDetailsForm which is self-contained */}
        <ProfileDetailsForm />
    </Stack>
  );
}