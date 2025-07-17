// src/components/layout/TopAppBar.tsx
import React, { useState } from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles'; // Import useTheme
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Button from '@mui/material/Button'; // Keep Button import

// Import Lucide icons
import {
  Sun,
  Moon,
  User as UserIconLucide,
  Settings,
  LogOut,
  Menu as MenuIcon,
  LogIn,
  UserPlus,
} from 'lucide-react';

// Import context and config
import { drawerWidth } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCustomTheme } from '@/hooks/useCustomTheme';

// --- Styled AppBar (Corrected Logic) ---
interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean; // Is the drawer open?
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open', // Prevent 'open' prop from reaching DOM
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  // marginRight: 5, // Add a small margin on the right side
  width: `calc(100% - ${65}px )`, // Adjust width for margin
  backgroundColor: theme.palette.primary.main, // Use secondary color when open
  transition: theme.transitions.create(
    ['width', 'margin', 'background-color'],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen, // Transition when closing drawer
    }
  ),
  // Styles applied when the drawer IS open
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px )`,
    transition: theme.transitions.create(
      ['width', 'margin', 'background-color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen, // Transition when opening drawer
      }
    ),
  }),
  // When closed, default width (100%) and margin (0) apply implicitly
}));
// --- End Styled AppBar ---

// Props for TopAppBar component
interface TopAppBarProps {
  open: boolean; // Drawer open state from parent
  handleDrawerOpen: () => void; // Function to open drawer from parent
  title: string; // Application title
}

export function TopAppBar({ open, handleDrawerOpen, title }: TopAppBarProps) {
  const { mode: currentThemeMode, toggleTheme } = useCustomTheme();
  const { isAuthenticated, signout } = useAuth(); // Get auth state and logout function

  // State for the profile menu anchor
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // --- UPDATED Handle Logout Action ---
  const handleLogout = () => {
    handleCloseUserMenu(); // Close the menu first
    signout(); // Call the logout function from AuthContext

    console.log('Logout initiated via AuthProvider.');
  };

  return (
    <AppBar position='fixed' open={open} enableColorOnDark>
      <Toolbar>
        {/* --- Drawer Open Button (Only show if authenticated and drawer is closed) --- */}
        {isAuthenticated && (
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 2, // Adjusted margin
              ...(open && { display: 'none' }), // Hide icon when drawer is open
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* App Title */}
        <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {/* Theme Toggle Button - Always visible */}
        <Tooltip
          title={`Toggle ${
            currentThemeMode === 'dark' ? 'light' : 'dark'
          } mode`}
        >
          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleTheme}
            color='inherit'
            aria-label='toggle theme'
          >
            {currentThemeMode === 'dark' ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </IconButton>
        </Tooltip>

        {/* Conditional Actions: User Menu or Login/Signup */}
        {isAuthenticated ? (
          // --- Authenticated User Actions ---
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open user menu'>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 1 }}
                color='inherit'
              >
                {/* Replace with Avatar if user data includes image */}
                <UserIconLucide size={24} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                component={Link}
                href='/profile'
                onClick={handleCloseUserMenu}
              >
                <ListItemIcon>
                  <UserIconLucide size={18} />
                </ListItemIcon>{' '}
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                href='/settings'
                onClick={handleCloseUserMenu}
              >
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>{' '}
                Settings
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogOut size={18} color='inherit' />
                </ListItemIcon>{' '}
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // --- Unauthenticated User Actions ---
          <Box sx={{ flexGrow: 0 }}>
            <Button
              color='inherit'
              startIcon={<LogIn size={18} />}
              component={Link}
              href='/login' // Corrected link
              sx={{ ml: 1 }}
            >
              SignIn {/* Corrected text */}
            </Button>
            <Button
              color='inherit'
              variant='outlined'
              startIcon={<UserPlus size={18} />}
              component={Link}
              href='/signup'
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
