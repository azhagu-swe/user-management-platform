// src/app/(app)/settings/layout.tsx
'use client';

import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
  Box,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Palette, Bell, CreditCard } from 'lucide-react';

const settingsNavItems = [
  { text: 'Profile', href: '/settings/profile', icon: <User size={20} /> },
  { text: 'Security', href: '/settings/security', icon: <Shield size={20} /> },
  { text: 'Theme', href: '/settings/theme', icon: <Palette size={20} /> },
  { text: 'Notifications', href: '/settings/notifications', icon: <Bell size={20} /> },
  { text: 'Billing', href: '/settings/billing', icon: <CreditCard size={20} /> },
  // Example for a B2B SaaS feature
  // { text: 'Organization', href: '/settings/organization', icon: <Building size={20} /> },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>
      <Grid container spacing={{xs: 3, md: 4}}>
        {/* Left Navigation */}
        <Grid size={{xs:12,md:3}}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 1 }}>
            <List>
              {settingsNavItems.map((item) => {
                // Example pathname could be /app/settings/profile
                // We check if the current path ends with the item's href
                const isSelected = pathname.endsWith(item.href);
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href} // Next.js Link handles the full path
                      selected={isSelected}
                      sx={{
                        borderRadius: '6px',
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          },
                          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                            color: 'primary.main',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{minWidth: 40}}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Right Content Area */}
        <Grid size={{xs:12,md:9}}>
          {/* The content from your page.tsx files (e.g., /settings/profile/page.tsx) will be rendered here */}
          <Box>{children}</Box>
        </Grid>
      </Grid>
    </Container>
  );
}
