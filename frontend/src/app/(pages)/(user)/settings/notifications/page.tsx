// src/app/(app)/settings/notifications/page.tsx
'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  FormControlLabel,
  Switch,
  //   Divider,
  Button,
} from '@mui/material';
import { Mail, Bell } from 'lucide-react'; // Icons for visual context

// A reusable component for a single notification setting
const NotificationSetting = ({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) => (
  <FormControlLabel
    control={<Switch defaultChecked={defaultChecked} />}
    labelPlacement='start'
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      ml: 0,
      py: 1,
      borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      '&:last-of-type': {
        borderBottom: 'none',
      },
    }}
    label={
      <Box>
        <Typography fontWeight='medium'>{title}</Typography>
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
      </Box>
    }
  />
);

export default function NotificationSettingsPage() {
  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }} variant='outlined'>
      <Stack spacing={4}>
        {/* Email Notifications Section */}
        <Box>
          <Stack direction='row' spacing={1.5} alignItems='center' mb={2}>
            <Mail size={22} />
            <Typography variant='h6' component='h2' fontWeight='bold'>
              Email Notifications
            </Typography>
          </Stack>
          <Stack>
            <NotificationSetting
              title='Product Updates'
              description='Receive news, feature updates, and special announcements.'
              defaultChecked={true}
            />
            <NotificationSetting
              title='Weekly Summary'
              description='Get a roundup of your account activity and key insights.'
            />
            <NotificationSetting
              title='Account Security Alerts'
              description='Receive alerts for important security events, like new logins.'
              defaultChecked={true}
            />
          </Stack>
        </Box>

        {/* In-App Notifications Section */}
        <Box>
          <Stack direction='row' spacing={1.5} alignItems='center' mb={2}>
            <Bell size={22} />
            <Typography variant='h6' component='h2' fontWeight='bold'>
              In-App Notifications
            </Typography>
          </Stack>
          <Stack>
            <NotificationSetting
              title='Mentions'
              description='Get notified when someone @mentions you in a comment.'
              defaultChecked={true}
            />
            <NotificationSetting
              title='New Comments'
              description='Get notified about new comments on items you follow.'
            />
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant='contained' size='large'>
          Save Preferences
        </Button>
      </Box>
    </Paper>
  );
}
