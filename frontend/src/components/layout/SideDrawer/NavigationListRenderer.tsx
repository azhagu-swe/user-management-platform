// src/components/layout/SideDrawer/NavigationListRenderer.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme, useTheme } from '@mui/material/styles';
import { NavItem, UserRole } from '@/config/navigation';

interface NavigationListRendererProps {
  items: NavItem[];
  open: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

export function NavigationListRenderer({
  items,
  open,
  isAuthenticated,
  userRole,
}: NavigationListRendererProps) {
  const theme = useTheme(); // Get the current theme object
  const pathname = usePathname(); // Get the current pathname

  // Filter items based on authentication and roles
  const visibleItems = items.filter((item) => {
    if (item.public) {
      return true;
    }
    if (!isAuthenticated) {
      return false;
    }
    if (item.roles && item.roles.length > 0) {
      return userRole !== null && item.roles.includes(userRole);
    }
    return true;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <List>
      {visibleItems.map((navItem) => {
        const isActive = pathname === navItem.href;

        return (
          <ListItem key={navItem.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              href={navItem.href}
              title={open ? undefined : navItem.text}
              aria-label={navItem.text}
              selected={isActive} // Optional: MUI's selected prop for ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5, // Horizontal padding for the whole button
                borderRadius: theme.shape.borderRadius,
                // Explicitly override and remove MUI's default hover effect for the button itself
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                // Optional: If using selected prop, MUI might apply its own selected styles.
                // You might need to override them if they conflict with your icon styling.
                '&.Mui-selected': {
                  backgroundColor: 'transparent', // Ensure selected button bg is also transparent
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  padding: theme.spacing(0.75),
                  borderRadius: '50%',
                  // Conditional styling for active state
                  backgroundColor: isActive
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  color: isActive
                    ? theme.palette.primary.contrastText
                    : theme.palette.action.active,
                  border: `1px solid ${
                    isActive
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`, // Active border blends, default is divider
                  transition: theme.transitions.create(
                    [
                      'background-color',
                      'color',
                      'border-color',
                      'transform',
                      'box-shadow',
                    ],
                    {
                      duration: theme.transitions.duration.short,
                    }
                  ),
                  // Hover styles
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    // borderColor: theme.palette.primary.dark, // On hover, border becomes darker shade of primary
                    // transform: 'scale(1.05)', // Optional
                    // boxShadow: theme.shadows[3], // Optional
                  },
                }}
              >
                {navItem.icon}
              </ListItemIcon>
              <ListItemText
                primary={navItem.text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.primary, // Text color active
                  pointerEvents: open ? 'auto' : 'none',
                  transition: (muiTheme: Theme) =>
                    muiTheme.transitions.create(['opacity', 'color'], {
                      // Added color to transition
                      duration: muiTheme.transitions.duration.shortest,
                    }),
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
