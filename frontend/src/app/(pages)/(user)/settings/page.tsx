'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

// This component's sole purpose is to redirect the user.
export default function SettingsRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default profile section
    router.replace('/settings/profile');
  }, [router]);

  // Render a loader while redirecting
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <CircularProgress />
    </Box>
  );
}