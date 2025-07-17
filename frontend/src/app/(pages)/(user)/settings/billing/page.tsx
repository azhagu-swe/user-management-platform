// src/app/(app)/settings/billing/page.tsx
'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  //   CardActions,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  alpha,
  useTheme,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Award,
  CreditCard,
  BarChart3,
  FileText,
  Download,
  //   MoreVert,
} from 'lucide-react';
import MoreVert from '@mui/icons-material/MoreVert';

const CurrentPlanCard = () => {
  const theme = useTheme();
  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
      }}
    >
      <CardContent>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <Box>
            <Stack direction='row' spacing={1.5} alignItems='center' mb={1}>
              <Award />
              <Typography variant='h6' fontWeight='bold'>
                Current Plan
              </Typography>
            </Stack>
            <Chip
              label='Pro Plan'
              color='primary'
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant='h4' fontWeight='bold' sx={{ mt: 2 }}>
              $29
              <Typography component='span' color='text.secondary'>
                /month
              </Typography>
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Your plan renews on July 10, 2025.
            </Typography>
          </Box>
          <Button variant='contained'>Upgrade Plan</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const UsageCard = () => (
  <Paper
    variant='outlined'
    sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}
  >
    <Stack spacing={2}>
      <Stack direction='row' spacing={1.5} alignItems='center' mb={1}>
        <BarChart3 />
        <Typography variant='h6' fontWeight='bold'>
          Usage This Month
        </Typography>
      </Stack>
      <Box>
        <Stack direction='row' justifyContent='space-between' mb={0.5}>
          <Typography variant='body2' fontWeight='medium'>
            Team Members
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            3 of 5 Used
          </Typography>
        </Stack>
        <LinearProgress variant='determinate' value={60} />
      </Box>
      <Box>
        <Stack direction='row' justifyContent='space-between' mb={0.5}>
          <Typography variant='body2' fontWeight='medium'>
            Projects
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            8 of 10 Used
          </Typography>
        </Stack>
        <LinearProgress variant='determinate' value={80} color='secondary' />
      </Box>
    </Stack>
  </Paper>
);

const PaymentMethodCard = () => {
  const theme = useTheme();
  return (
    <Paper
      variant='outlined'
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}
    >
      <Stack spacing={2}>
        <Stack direction='row' spacing={1.5} alignItems='center' mb={1}>
          <CreditCard />
          <Typography variant='h6' fontWeight='bold'>
            Payment Method
          </Typography>
        </Stack>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          p={2}
          sx={{
            backgroundColor: alpha(theme.palette.action.selected, 0.05),
            borderRadius: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 32,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <CreditCard size={24} color={theme.palette.primary.main} />
            </Box>
            <Box>
              <Typography fontWeight='medium'>Visa ending in 1234</Typography>
              <Typography variant='caption' color='text.secondary'>
                Expires 08/2028
              </Typography>
            </Box>
          </Box>
          <IconButton size='small'>
            <MoreVert />
          </IconButton>
        </Stack>
        <Button variant='outlined' size='small'>
          Update Payment Method
        </Button>
      </Stack>
    </Paper>
  );
};

const InvoiceHistoryTable = () => {
  const invoices = [
    {
      id: 'INV-2025-003',
      date: 'June 1, 2025',
      amount: '$29.00',
      status: 'Paid',
    },
    {
      id: 'INV-2025-002',
      date: 'May 1, 2025',
      amount: '$29.00',
      status: 'Paid',
    },
    {
      id: 'INV-2025-001',
      date: 'April 1, 2025',
      amount: '$29.00',
      status: 'Paid',
    },
  ];
  return (
    <Paper variant='outlined' sx={{ borderRadius: 2 }}>
      <Box p={3}>
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <FileText />
          <Typography variant='h6' fontWeight='bold'>
            Invoice History
          </Typography>
        </Stack>
      </Box>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell sx={{ fontWeight: 'medium' }}>
                  {invoice.id}
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color='success'
                    size='small'
                    variant='outlined'
                  />
                </TableCell>
                <TableCell align='right'>
                  <Tooltip title='Download Invoice'>
                    <IconButton size='small'>
                      <Download size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default function BillingPage() {
  return (
    <Stack spacing={4}>
      <CurrentPlanCard />
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <UsageCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaymentMethodCard />
        </Grid>
      </Grid>
      <InvoiceHistoryTable />
    </Stack>
  );
}
