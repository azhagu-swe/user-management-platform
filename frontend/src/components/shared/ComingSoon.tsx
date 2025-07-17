// Suggested path: src/components/shared/ComingSoon.tsx
// Or use it directly in a page file like src/app/some-feature/page.tsx

import React from 'react';
import Link from 'next/link'; // Import Next.js Link for client-side navigation
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Keep using theme for colors
import { Rocket, Code, Coffee } from 'lucide-react'; // Add some relevant icons

const ComingSoon = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Keep existing styles for layout
        minHeight: '70vh', // Use minHeight instead of height: 100vh if used within existing layout
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.text.primary,
        p: 4, // Use theme spacing if preferred: theme.spacing(4)
        mt: -8, // Adjust margin slightly if needed within MainLayout's padding
      }}
    >
      {/* Fun Icon */}
      <Rocket
        size={64}
        color={theme.palette.secondary.main}
        style={{ marginBottom: theme.spacing(2) }}
      />

      {/* Catchy Title */}
      <Typography variant='h3' sx={{ mb: 2, fontWeight: 'bold' }}>
        Code Compiling... Awesomeness Pending!
      </Typography>
      {/* Fun Subtitle */}
      <Typography
        variant='h6'
        color='text.secondary'
        sx={{ mb: 4, maxWidth: '600px' }}
      >
        This part of the app is still in the `dev` branch!{' '}
        <Code size={18} style={{ verticalAlign: 'middle' }} /> Our team is
        merging features, squashing bugs, and probably drinking lots of{' '}
        <Coffee size={18} style={{ verticalAlign: 'middle' }} />
        {`. Check back soon to see what we've deployed!`}
      </Typography>
      {/* Keep the Button, use Next.js Link */}
      <Button
        component={Link} // Use Next.js Link component
        href='/'
        variant='contained'
        color='secondary' // Keep the engaging secondary color
        size='large'
        sx={{
          // textTransform: "uppercase", // Optional: remove if too shouty
          fontWeight: 'bold',
          px: 5, // Adjust padding as needed
          py: 1.5,
          boxShadow: theme.shadows[4], // Use theme shadows
          '&:hover': {
            boxShadow: theme.shadows[8], // Enhance hover effect
          },
        }}
      >
        Return to Home Base
      </Button>
    </Box>
  );
};

export default ComingSoon;
