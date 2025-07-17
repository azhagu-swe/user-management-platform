// src/features/user-profile/components/ProfileHeader.tsx
'use client';

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
//   IconButton,
//   Tooltip,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import { Edit2 } from 'lucide-react';
import { UserInfo } from '@/types'; // Assuming global UserInfo type

interface ProfileHeaderProps {
  user: UserInfo | null;
}

// Helper to assign colors to roles for the chip
const roleColorMap: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  SuperAdmin: 'error',
  AccountAdmin: 'warning',
  Manager: 'primary',
  User: 'info',
//   default: 'default',
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = useTheme();

  if (!user) {
    return null; // Or return a skeleton loader
  }

  const roleChipColor = roleColorMap[user.role] || roleColorMap.default;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 2,
        position: 'relative', // For positioning elements inside
      }}
    >
      <Box
        sx={{
          height: 100,
          borderRadius: '6px', // Slightly rounded corners for the banner
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,
          mb: -6, // Pull the avatar up to overlap this banner
        }}
      />
      <Box sx={{ px: 2, textAlign: 'center' }}>
        <Avatar
          alt={user.username}
          // src={user.avatarUrl || ''} // Use this if you have avatar URLs
          sx={{
            width: 100,
            height: 100,
            fontSize: '2.5rem', // Larger initial
            border: `4px solid ${theme.palette.background.paper}`, // Border to lift it off the banner
            mx: 'auto', // Center the avatar
            mb: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5" component="h1" fontWeight="bold">
          {user.username}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {user.email}
        </Typography>
        <Chip label={user.role} color={roleChipColor} size="small" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }} />
      </Box>
    </Paper>
  );
}
