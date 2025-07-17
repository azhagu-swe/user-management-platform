'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { useRouter } from 'next/navigation'; // Not strictly needed here unless redirecting
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'; // Using ArrowLeft for back, CheckCircle for success
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { AuthFormField } from '@/features/authentication/components/AuthFormField';

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const router = useRouter();
  const {
    requestPasswordReset,
    isLoading,
    error: authError, // Error from the auth context (e.g., network issues)
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (authError) clearError();
    if (successMessage) setSuccessMessage(null); // Clear success message on new input
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authError) clearError();
    setSuccessMessage(null);
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    const success = await requestPasswordReset(email);

    if (success) {
      setSuccessMessage(
        'If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).'
      );
      setEmail(''); // Clear the email field
    } else if (!authError) {
      // If requestPasswordReset returns false but doesn't set a specific authError,
      // you might set a generic error here, or rely on the success message's phrasing.
      // For now, we'll rely on authError for specific API/network issues.
      // The success message is phrased to cover cases where the email might not exist.
    }
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          position: 'relative', // For potential close button if desired, though not explicitly requested here
          width: '100%',
          p: { xs: 2.5, sm: 4 },
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          border: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(8px)',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          color: theme.palette.text.primary,
        }}
      >
        {/* Optional: Back to Sign In Button - if not using a global layout header */}
        <IconButton
          aria-label='back to sign in'
          onClick={() => router.push('/signin')}
          sx={{
            position: 'absolute',
            left: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
            top: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.action.active, 0.04),
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.active, 0.08),
            },
          }}
        >
          <ArrowLeft size={24} />
        </IconButton>

        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3, mt: { xs: 3, sm: 0 } }}>
          <Typography
            variant='h4'
            component='h1'
            sx={{ mb: 1, fontWeight: 'bold' }}
          >
            Forgot Password?
          </Typography>
          <Typography
            variant='body2'
            display='block'
            sx={{ color: theme.palette.text.secondary, mb: 2 }}
          >
            {`No worries! Enter your email address below and we'll send you a link to reset your password.`}
          </Typography>
        </Box>

        {/* Forgot Password Form */}
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <AnimatePresence>
            {authError &&
              !successMessage && ( // Show authError only if no success message
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    severity='error'
                    sx={{ width: '100%' }}
                    onClose={clearError}
                  >
                    {authError}
                  </Alert>
                </motion.div>
              )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity='success'
                  sx={{ width: '100%' }}
                  icon={<CheckCircle size={20} />} // Using Lucide icon
                  onClose={() => setSuccessMessage(null)}
                >
                  {successMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {!successMessage && ( // Only show form if no success message
            <AuthFormField
              name='email'
              label='Email Address'
              value={email}
              onChange={handleInputChange} // Simpler onChange if only one field uses it directly
              isLoading={isLoading}
              startIcon={Mail}
              fieldError={formErrors.email}
              autoComplete='email'
              autoFocus
              type='email'
            />
          )}

          {/* Submit Button - Only show if no success message */}
          {!successMessage && (
            <Box component={motion.div} sx={{ mt: 2 }}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={isLoading}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </Box>
          )}
        </Box>

        {/* Footer Link - Show whether success or not, to allow navigation */}
        <Typography
          component={motion.div}
          variant='body2'
          sx={{
            textAlign: 'center',
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Remember your password?{' '}
          <MuiLink
            component={Link}
            href='/signin' // Path to your signin page
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'medium',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Sign In
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}
