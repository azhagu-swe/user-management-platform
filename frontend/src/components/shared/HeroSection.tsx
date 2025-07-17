// src/components/shared/HeroSection.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import Link from 'next/link';
import { Container, Paper, Typography, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <Paper
      elevation={0}
      sx={{
        py: { xs: 6, md: 10 },
        textAlign: 'center',
        // Functions in sx prop are okay in Client Components
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.primary.light,
        color: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.primary.contrastText,
        borderRadius: 0,
        backgroundImage: (theme) =>
          theme.palette.mode === 'light'
            ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
            : `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      <Container maxWidth='md'>
        <Typography
          variant='h2'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Level Up Your Skills
        </Typography>
        <Typography
          variant='h5'
          component='p'
          color='inherit'
          sx={{ mb: 4, opacity: 0.9 }}
        >
          Explore expert-led courses, series, and tutorials in Programming and
          AI.
        </Typography>
        <Link href='/courses' passHref legacyBehavior>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            endIcon={<ArrowRight />}
            sx={{
              color: (theme) => theme.palette.secondary.contrastText,
              py: 1.5,
              px: 4,
            }}
          >
            Browse Courses
          </Button>
        </Link>
      </Container>
    </Paper>
  );
}
