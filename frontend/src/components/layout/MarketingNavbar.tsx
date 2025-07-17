// src/components/layout/MarketingNavbar.tsx
'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  //   Button,
  Box,
  Container,
} from '@mui/material';
import Link from 'next/link';
import { alpha, useTheme } from '@mui/material/styles';
import { Sparkles } from 'lucide-react'; // Example icon for your brand

export default function MarketingNavbar() {
  const theme = useTheme();
  return (
    <AppBar
      position='sticky'
      color='transparent'
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <Sparkles size={28} color={theme.palette.primary.main} />
          <Typography
            variant='h6'
            noWrap
            component={Link}
            href='/'
            sx={{
              ml: 2,
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            User managerment
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Add other nav links like 'Features', 'Pricing' here if needed */}
            {/* <Button component={Link} href="/auth/signin" color="inherit">
              Sign In
            </Button>
            <Button component={Link} href="/request-access" variant="contained">
              Request Access
            </Button> */}
          </Box>
          {/* Add a Mobile Menu (IconButton + Menu) here if you have more nav links */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
