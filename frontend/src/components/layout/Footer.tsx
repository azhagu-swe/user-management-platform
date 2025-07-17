// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  // Link ,
  Stack,
  IconButton,
  // Divider,
} from '@mui/material';
import { Twitter, Linkedin } from 'lucide-react'; // Example icons
import { drawerWidth } from '@/config/navigation';

// --- Props Interface ---
interface FooterProps {
  open?: boolean; // Is the sidebar open?
  // drawerWidth: number; // The width of the open sidebar
}

// --- Styled Footer Component ---
// This styled component now accepts an `open` prop to adjust its styles.
const FooterRoot = styled('footer', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<{ open?: boolean; drawerWidth: number }>(({ theme, open, drawerWidth }) => ({
  // Apply a smooth transition to width and margin that matches the sidebar's transition
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(2, 2),

  // --- Dynamic styles based on the sidebar's `open` state ---
  ...(open && {
    // When sidebar is OPEN
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    // When sidebar is CLOSED
    // This logic should mirror the closedMixin from your SideDrawer component for perfect alignment
    width: `calc(100% - calc(${theme.spacing(7)} + 1px))`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - calc(${theme.spacing(8)} + 1px))`,
    },
  }),
}));

// --- Main Footer Component ---
export default function Footer({ open }: FooterProps) {
  return (
    <FooterRoot open={open} drawerWidth={drawerWidth}>
      <Container maxWidth='lg'>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              &copy; {new Date().getFullYear()} User managerment Inc. All rights
              reserved.
            </Typography>
            <Stack direction='row' spacing={1}>
              <IconButton
                component='a'
                href='#'
                aria-label='twitter'
                size='small'
              >
                <Twitter size={18} />
              </IconButton>

              <IconButton
                component='a'
                href='#'
                aria-label='linkedin'
                size='small'
              >
                <Linkedin size={18} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </FooterRoot>
  );
}
