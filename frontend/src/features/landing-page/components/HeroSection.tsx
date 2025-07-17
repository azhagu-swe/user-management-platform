// src/features/landing-page/components/HeroSection.tsx
'use client';

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const theme = useTheme();
  return (
    <Container
      maxWidth='lg'
      sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant='h2'
          component='h1'
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            letterSpacing: '-0.025em',
            mb: 2,
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Your SaaS, Elevated.
        </Typography>
        <Typography
          variant='h6'
          color='text.secondary'
          sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}
        >
          User managerment provides the ultimate starter template for building
          professional, scalable SaaS applications with ease. Focus on your
          product, not the boilerplate.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent='center'
        >
          <Button
            component={Link}
            href='/request-access'
            variant='contained'
            size='large'
            endIcon={<ArrowRight size={18} />}
            sx={{ py: 1.5, px: 4 }}
          >
            Get Started Now
          </Button>
          <Button
            href='#' // Link to your demo video or a "learn more" section
            variant='outlined'
            size='large'
            startIcon={<PlayCircle size={18} />}
            sx={{ py: 1.5, px: 4 }}
          >
            Watch Demo
          </Button>
        </Stack>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Paper
          elevation={0}
          variant='outlined'
          sx={{
            mt: { xs: 8, md: 12 },
            height: { xs: 200, sm: 350, md: 500 },
            borderRadius: 3,
            background: `url(/path/to/your/product-screenshot.png) no-repeat center center`, // Placeholder image
            backgroundSize: 'cover',
            borderWidth: '1px',
            borderColor: theme.palette.divider,
            boxShadow: `0px 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        />
      </motion.div>
    </Container>
  );
}
