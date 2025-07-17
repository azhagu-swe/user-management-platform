// src/components/layout/SideDrawer/DrawerFooterActions.tsx
import React from 'react';
import Link from 'next/link'; // Keep for Sign In/Up links
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Theme, useTheme } from '@mui/material/styles';


import {
  Sun,
  Moon,
  LogIn,
  UserPlus,
  LogOut, // Import LogOut icon
} from 'lucide-react';
import { NavigationListRenderer } from './NavigationListRenderer';
import { secondaryNavItems, UserRole } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCustomTheme } from '@/hooks/useCustomTheme';

interface DrawerFooterActionsProps {
  open: boolean; // To show/hide text based on drawer state
}

export function DrawerFooterActions({ open }: DrawerFooterActionsProps) {
  const { mode: currentThemeMode, toggleTheme } = useCustomTheme();
  const { isAuthenticated, signout, user } = useAuth(); // Get logout function
  const theme = useTheme();
  const userRole: UserRole | null = (user?.role as UserRole) || null;

  const commonListItemButtonStyles = {
    minHeight: 48,
    justifyContent: open ? 'initial' : 'center',
    px: 2.5,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiListItemIcon-root': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        // borderRadius: '50%', // Already set in commonListItemIconStyles
      },
    },
  };

  const commonListItemIconStyles = {
    minWidth: 0,
    mr: open ? 3 : 'auto',
    justifyContent: 'center',
    color: 'inherit',
    padding: theme.spacing(0.75),
    borderRadius: '50%',
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
  };

  const commonListItemTextStyles = {
    opacity: open ? 1 : 0,
    color: 'text.primary',
    transition: (muiTheme: Theme) =>
      muiTheme.transitions.create('opacity', {
        duration: muiTheme.transitions.duration.shortest,
      }),
  };

  return (
    <Box sx={{ mt: 'auto' }}>
      {' '}
      {/* Pushes this section to the bottom */}
      <Divider />
      <List>
        {/* Conditional Auth Links */}
        {isAuthenticated ? (
          // --- Logout Button (if authenticated) ---
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={signout} // Call the logout function from useAuth
              title='Sign Out'
              aria-label='Sign Out'
              sx={{
                ...commonListItemButtonStyles,
                // Optional: different hover for logout if desired
                // '&:hover': {
                //   backgroundColor: theme.palette.error.light,
                //   '& .MuiListItemIcon-root': {
                //     backgroundColor: theme.palette.error.main,
                //     color: theme.palette.error.contrastText,
                //   },
                // },
              }}
            >
              <ListItemIcon
                sx={{
                  ...commonListItemIconStyles,
                  // color: theme.palette.error.main, // Optional: make icon color red by default
                }}
              >
                <LogOut size={20} />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary='Sign Out'
                  sx={commonListItemTextStyles}
                />
              )}
            </ListItemButton>
          </ListItem>
        ) : (
          // --- Sign In / Sign Up Links (if not authenticated) ---
          <>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                href='/signin'
                title='Sign In'
                aria-label='Sign In'
                sx={commonListItemButtonStyles}
              >
                <ListItemIcon sx={commonListItemIconStyles}>
                  <LogIn size={20} />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary='Sign In'
                    sx={commonListItemTextStyles}
                  />
                )}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                href='/signup'
                title='Sign Up'
                aria-label='Sign Up'
                sx={commonListItemButtonStyles}
              >
                <ListItemIcon sx={commonListItemIconStyles}>
                  <UserPlus size={20} />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary='Sign Up'
                    sx={commonListItemTextStyles}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </>
        )}
        {isAuthenticated && secondaryNavItems.length > 0 && (
          <>
            <NavigationListRenderer
              items={secondaryNavItems}
              open={open}
              isAuthenticated={isAuthenticated}
              userRole={userRole}
            />
          </>
        )}
        {/* 1. Dark and White Theme Toggle */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={toggleTheme}
            title={`Toggle ${currentThemeMode === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Toggle ${currentThemeMode === 'dark' ? 'light' : 'dark'} mode`}
            sx={commonListItemButtonStyles}
          >
            <ListItemIcon sx={commonListItemIconStyles}>
              {currentThemeMode === 'dark' ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={
                  currentThemeMode === 'light' ? 'Dark Mode' : 'Light Mode'
                }
                sx={commonListItemTextStyles}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
