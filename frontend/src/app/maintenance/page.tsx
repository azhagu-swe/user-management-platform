'use client';

import React from 'react';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HardHat } from 'lucide-react'; // Or Construction, Settings2

export default function MaintenancePage() {
  const theme = useTheme();

  return (
    <Container
      maxWidth='md' // Can be a bit wider for more text
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
        <HardHat
          size={64}
          color={theme.palette.warning.main}
          style={{ marginBottom: theme.spacing(2) }}
        />
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Under Maintenance 🛠️
        </Typography>
        <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
          {"We're currently sprucing things up!"}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          {`Our apologies, but User managerment is temporarily unavailable as we perform
          scheduled maintenance. We're working hard to make things even better
          and expect to be back online shortly.`}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
          Thank you for your patience!
        </Typography>
        <CircularProgress color='warning' />
        {/* Optional: Add an estimated time back or contact info */}
        {/*
        <Typography variant="caption" color="text.disabled" sx={{mt: 3}}>
          Estimated return: Today at 14:00 UTC
        </Typography>
        <Typography variant="caption" color="text.disabled">
          For urgent matters, contact us at support@allpings.com
        </Typography>
        */}
      </Paper>
    </Container>
  );
}
