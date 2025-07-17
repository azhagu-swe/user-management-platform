'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

// import { TopAppBar } from "./TopAppBar";
// import { SideDrawer } from "./SideDrawer";
import Footer from './Footer';
import { SideDrawer } from './SideDrawer';
import { SnackbarProvider } from '@/providers/SnackbarProvider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true); // Drawer state

  // const handleDrawerOpen = () => {
  //   setOpen(!open);
  // };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Ensure column flex and min height */}
      <CssBaseline />
      {/* <TopAppBar open={open} handleDrawerOpen={handleDrawerOpen} title="Tutorial App" /> */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Inner flex row for drawer/main */}
        <SideDrawer open={open} handleDrawerClose={handleDrawerClose} />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* Spacer */}
          <SnackbarProvider>
            {children} {/* Page Content */}
          </SnackbarProvider>
        </Box>
      </Box>
      <Footer open={open} /> {/* Add Footer Here */}
    </Box>
  );
}
