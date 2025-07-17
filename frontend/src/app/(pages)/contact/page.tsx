// src/app/(app)/contact/page.tsx
'use client'; // Needed for form state

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Mail, Send } from 'lucide-react';

export default function ContactPage() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'success' | 'error' | null>(
    null
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setSendStatus(null);
    console.log('Simulating sending message:', { name, email, message });

    // --- Simulate API Call ---
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const success = Math.random() > 0.2; // Simulate success/failure
    // --- Replace with actual API call ---

    setIsSending(false);
    if (success) {
      setSendStatus('success');
      // Optionally clear form
      // setName(''); setEmail(''); setMessage('');
    } else {
      setSendStatus('error');
    }
  };

  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 5 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Mail
            size={48}
            color={theme.palette.primary.main}
            style={{ marginBottom: '8px' }}
          />
          <Typography
            variant='h3'
            component='h1'
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Get In Touch 📧
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            {` Want to report a bug, suggest a feature, or just say "Hello, World?"
            Our inbox is always open (except during code freezes).`}
          </Typography>
          <Typography
            variant='caption' // Smaller for quote
            fontStyle='italic'
            color='text.secondary'
            component='p' // Use paragraph for block display
            sx={{ mt: 2, display: 'inline-block' }}
          >
            {'My code compiles. I am not sure why it works.'}
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id='name'
                label='Your Name / Handle'
                name='name'
                autoComplete='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSending}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id='email'
                label='Your Email'
                name='email'
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={5}
                id='message'
                label='Your Message / Bug Report / Feature Idea'
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
              {sendStatus === 'success' && (
                <Alert severity='success' sx={{ mb: 2 }}>
                  {`Message sent successfully! We'll get back to you (maybe).`}
                </Alert>
              )}
              {sendStatus === 'error' && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {`Couldn't send message. Please try again later.`}
                </Alert>
              )}
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                disabled={isSending}
                startIcon={
                  isSending ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <Send size={18} />
                  )
                }
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
