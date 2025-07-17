'use client';

import React, { useEffect } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const theme = useTheme();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        py: { xs: 4, sm: 6 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <AlertTriangle
          size={64}
          color={theme.palette.error.main}
          style={{ marginBottom: theme.spacing(2) }}
        />
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Something Went Wrong 😟
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 1 }}>
          {'Even the best explorers encounter unexpected terrain.'}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          We apologize for the inconvenience. An unexpected error occurred.
          Please try again, or contact support if the issue persists.
        </Typography>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <Box
            sx={{
              my: 2,
              p: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              width: '100%',
              overflowX: 'auto',
            }}
          >
            <Typography
              variant='caption'
              display='block'
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Error Details (Development Mode):
            </Typography>
            <Typography
              variant='caption'
              display='block'
              component='pre'
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                textAlign: 'left',
              }}
            >
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
              {/* error.stack could be logged but might be too verbose for UI */}
            </Typography>
          </Box>
        )}
        <Button
          onClick={() => reset()} // Attempt to recover by re-rendering the segment
          variant='contained'
          size='large'
        >
          Try Again
        </Button>
      </Paper>
    </Container>
  );
}
