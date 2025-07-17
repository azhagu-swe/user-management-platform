import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight, Code2 } from 'lucide-react'; // Using Code2 from Lucide as an alternative logo

// Styled component for the header area within the drawer
// This matches the original DrawerHeader styling from your SideDrawer.tsx
const StyledDrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1), // Keep horizontal padding
  position: 'relative', // Needed for absolute positioning of the toggle button
  ...theme.mixins.toolbar, // Standard Material UI toolbar height
}));

// Styled component for the toggle button
// This matches the original StyledIconButton styling
const ToggleDrawerButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: '-10px', // Positioned to slightly overlap the drawer edge
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper, // Ensure visibility against drawer
  // border: `1px solid ${theme.palette.divider}`,
  borderRadius: '50%',
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
  zIndex: theme.zIndex.drawer + 1, // Ensure it's above the drawer
}));

interface DrawerHeaderContentProps {
  open: boolean;
  handleDrawerClose: () => void;
  appName?: string; // Optional app name, defaults to "CodeMaster"
  useLucideLogo?: boolean; // Prop to decide which logo icon to use
}

export function DrawerHeaderContent({
  open,
  handleDrawerClose,
  appName = 'User managerment',
}: DrawerHeaderContentProps) {
  const ToggleIcon = open ? ChevronLeft : ChevronRight;

  return (
    <StyledDrawerHeader>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          // Adjust padding based on open state for better alignment of logo when closed
          pl: open ? 2 : 1.75, // Slightly less padding when closed for centered icon
          opacity: open ? 1 : 0.9, // Logo can be slightly visible when closed
          transition: (theme: Theme) =>
            theme.transitions.create(['opacity', 'padding-left'], {
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Link
          href='/'
          passHref
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Code2 size={open ? 28 : 24} />
          {open && (
            <Typography variant='h6' noWrap sx={{ ml: 1.5 }}>
              {appName}
            </Typography>
          )}
        </Link>
      </Box>

      <ToggleDrawerButton
        onClick={handleDrawerClose}
        aria-label={open ? 'close drawer' : 'open drawer'}
      >
        <ToggleIcon size={15} />
      </ToggleDrawerButton>
    </StyledDrawerHeader>
  );
}
