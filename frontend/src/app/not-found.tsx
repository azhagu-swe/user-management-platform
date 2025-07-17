'use client'; 

import React from 'react';
import Link from 'next/link';
import { Button, Container, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Compass } from 'lucide-react'; // Or use FileSearch, AlertCircle, etc.

export default function NotFound() {
  const theme = useTheme();

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Takes full viewport height
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
        <Compass
          size={64}
          color={theme.palette.primary.main}
          style={{ marginBottom: theme.spacing(2) }}
        />
        <Typography
          variant='h1'
          component='h2'
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '4rem', sm: '6rem' },
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'medium', mb: 2 }}
        >
          Oops! Page Lost in Space 🌌
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          {
            "It seems we've taken a wrong turn. The page you're looking for isn't in our map."
          }
        </Typography>
        <Button
          component={Link}
          href='/'
          variant='contained'
          size='large'
          startIcon={<Compass size={20} />}
        >
          Navigate Home
        </Button>
      </Paper>
    </Container>
  );
}
