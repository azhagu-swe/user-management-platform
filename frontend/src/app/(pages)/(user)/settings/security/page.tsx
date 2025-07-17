// src/app/(app)/settings/security/page.tsx
'use client';
import React from 'react';
import ChangePasswordForm from '@/features/user-profile/components/ChangePasswordForm';
import { Stack, Typography, Paper } from '@mui/material';

// This is a placeholder for a future 2FA component
const TwoFactorAuthSection = () => (
    <Paper variant='outlined' sx={{p: 3, borderRadius: 2}}>
        <Typography variant='h6' component='h2' gutterBottom>Two-Factor Authentication (2FA)</Typography>
        <Typography color="text.secondary">
            Add an extra layer of security to your account.
        </Typography>
        {/* Add 2FA setup component here later */}
    </Paper>
)

export default function SecuritySettingsPage() {
  return (
    <Stack spacing={4}>
      <ChangePasswordForm />
      <TwoFactorAuthSection />
      {/* You can add more security-related components here, like "Active Sessions" or "Account Deletion" */}
    </Stack>
  );
}