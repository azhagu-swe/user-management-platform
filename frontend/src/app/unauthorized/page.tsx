'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ShieldAlert } from 'lucide-react'; // Or Lock, ShieldOff

export default function UnauthorizedPage() {
  const theme = useTheme();

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
        <ShieldAlert
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
          Access Denied 🚫
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 1 }}>
          {"Looks like you've stumbled upon a restricted zone."}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          You do not have the necessary permissions to view this page. If you
          believe this is an error, please contact support.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Button component={Link} href='/' variant='outlined' size='large'>
            Go to Homepage
          </Button>
          <Button
            component={Link}
            href='/auth/signin' // Assuming this is your sign-in path
            variant='contained'
            size='large'
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
