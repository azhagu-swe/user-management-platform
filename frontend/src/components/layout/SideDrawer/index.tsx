// src/components/layout/SideDrawer/index.tsx
import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled, Theme, CSSObject } from '@mui/material/styles';

// Import sub-components
import { DrawerHeaderContent } from './DrawerHeaderContent';
import { DrawerFooterActions } from './DrawerFooterActions';

// Import hooks and config
import { drawerWidth, mainNavItems, UserRole } from '@/config/navigation'; // Ensure path is correct
import { NavigationListRenderer } from './NavigationListRenderer';
import { useAuth } from '@/hooks/useAuth';

// --- Drawer Styling (Mixins and Styled Drawer Component) ---

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`, // Standard width for closed drawer icons
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`, // Slightly wider on small screens and up
  },
});

// The main Drawer styled component
const StyledMuiDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

// --- Main SideDrawer Component ---

interface SideDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  appName?: string; // Pass down to header
  useLucideLogo?: boolean; // Pass down to header
}

export function SideDrawer({
  open,
  handleDrawerClose,
  appName, // Optional, will use default in DrawerHeaderContent if not provided
  useLucideLogo, // Optional
}: SideDrawerProps) {
  const { isAuthenticated, user } = useAuth();
  // Explicitly type userRole based on your UserRole enum/type from navigation config
  // Fallback to 'guest' if user or user.role is undefined/null
  const userRole: UserRole | null = (user?.role as UserRole) || null;
  const guestRoleFallback: UserRole = 'guest'; // Define fallback for clarity

  return (
    <StyledMuiDrawer variant='permanent' open={open}>
      {/* Drawer Header Section */}
      <DrawerHeaderContent
        open={open}
        handleDrawerClose={handleDrawerClose}
        appName={appName}
        useLucideLogo={useLucideLogo}
      />
      <Divider />

      {/* Scrollable area for navigation lists */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Main Navigation Items */}
        <NavigationListRenderer
          items={mainNavItems}
          open={open}
          isAuthenticated={isAuthenticated}
          userRole={userRole ?? guestRoleFallback}
        />

        {/* Secondary Navigation Items (conditionally rendered) */}
      </Box>

      {/* Drawer Footer Actions Section */}
      <DrawerFooterActions open={open} />
    </StyledMuiDrawer>
  );
}
