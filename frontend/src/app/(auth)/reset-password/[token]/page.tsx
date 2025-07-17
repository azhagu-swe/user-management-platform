// src/app/(auth)/reset-password/[token]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  // IconButton, // No explicit back button here, using links instead
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better type checking

import { useAuth } from '@/hooks/useAuth';
import { AuthFormField } from '@/features/authentication/components/AuthFormField';
import { ResetPasswordPayload } from '@/features/authentication/types/auth';
import { callValidateResetTokenApi } from '@/features/authentication/services/auth';

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

// Animation variants for alerts
const alertVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function ResetPasswordPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const token = typeof params.token === 'string' ? params.token : '';

  const {
    resetPassword,
    isLoading: isSubmitting,
    error: authError, // Error from the resetPassword submission
    clearError,
    isAuthenticated, // To check if user is already logged in
    isInitializing: authIsInitializing, // To check if auth state is being loaded
  } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isTokenValidationLoading, setIsTokenValidationLoading] =
    useState(true);
  const [isTokenInitiallyValid, setIsTokenInitiallyValid] = useState(false);
  const [initialTokenErrorMessage, setInitialTokenErrorMessage] = useState<
    string | null
  >(null);

  // Effect to redirect if user is already authenticated
  useEffect(() => {
    if (!authIsInitializing && isAuthenticated) {
      router.push('/'); // Redirect to dashboard or home
    }
  }, [isAuthenticated, authIsInitializing, router]);

  // Effect for initial token validation
  useEffect(() => {
    if (!token) {
      setInitialTokenErrorMessage(
        'Password reset token is missing or invalid.'
      );
      setIsTokenInitiallyValid(false);
      setIsTokenValidationLoading(false);
      return;
    }

    const validateToken = async () => {
      setIsTokenValidationLoading(true);
      setInitialTokenErrorMessage(null);
      try {
        await callValidateResetTokenApi(token);
        setIsTokenInitiallyValid(true);
      } catch (error: unknown) {
        setIsTokenInitiallyValid(false);
        let specificMessage =
          'This password reset link is invalid or has expired.';
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message?: string }>; // Assume error data has a message field
          const apiErrorMessage = axiosError.response?.data?.message;
          if (typeof apiErrorMessage === 'string') {
            specificMessage = apiErrorMessage;
          } else if (axiosError.message) {
            specificMessage = axiosError.message;
          }
        } else if (error instanceof Error) {
          specificMessage = error.message;
        }
        setInitialTokenErrorMessage(specificMessage);
      } finally {
        setIsTokenValidationLoading(false);
      }
    };

    if (!isAuthenticated) {
      // Only validate token if user is not already authenticated (and being redirected)
      validateToken();
    } else {
      setIsTokenValidationLoading(false); // Skip validation if user is auth and will be redirected
    }
  }, [token, isAuthenticated]); // Add isAuthenticated to dependency array

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: keyof FormErrors
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (authError) clearError();
      if (successMessage) setSuccessMessage(null);
    };

  const validateSubmitForm = (): boolean => {
    const errors: FormErrors = {};
    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      // Increased minimum length slightly
      errors.newPassword = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm new password is required.';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authError) clearError();
    setSuccessMessage(null);
    setFormErrors({});

    if (!validateSubmitForm()) {
      return;
    }

    const payload: ResetPasswordPayload = { token, newPassword };
    const success = await resetPassword(payload);

    if (success) {
      setSuccessMessage(
        'Your password has been successfully reset! You will be redirected to sign in shortly.'
      );
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/auth/signin'); // Corrected path
      }, 3000);
    }
  };

  // Initial loading states (auth check or token validation)
  if (authIsInitializing || isTokenValidationLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={50} />
        <Typography variant='h6'>
          {authIsInitializing ? 'Loading session...' : 'Verifying link...'}
        </Typography>
      </Box>
    );
  }

  // If initial token validation failed
  if (!isTokenInitiallyValid) {
    return (
      <Container
        maxWidth='xs'
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center', // Center align content within the container
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: { xs: 3, sm: 4 }, // Consistent padding
            borderRadius: 2,
            boxShadow: theme.shadows[3], // Softer shadow for error state card
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper, // Use paper background
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mb: 2,
            }}
          >
            <AlertTriangle size={48} color={theme.palette.error.main} />
          </Box>
          <Typography
            variant='h5'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 'medium' }}
          >
            Link Invalid or Expired
          </Typography>
          <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
            {initialTokenErrorMessage ||
              'This password reset link is invalid or has expired.'}
          </Alert>
          <Button
            component={Link}
            href='/auth/forgot-password'
            variant='contained'
            sx={{ mb: 2 }}
            fullWidth
          >
            Request New Reset Link
          </Button>
          <MuiLink component={Link} href='/auth/signin' variant='body2'>
            Back to Sign In
          </MuiLink>
        </Box>
      </Container>
    );
  }

  // If token is initially valid, show the password reset form
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
      <Box // Main card Box
        sx={{
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant='h4'
            component='h1'
            sx={{ mb: 1, fontWeight: 'bold' }}
          >
            Reset Your Password
          </Typography>
          {!successMessage && (
            <Typography
              variant='body2'
              display='block'
              sx={{ color: theme.palette.text.secondary, mb: 2 }}
            >
              Choose a new strong password.
            </Typography>
          )}
        </Box>

        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} // Consistent gap
        >
          <AnimatePresence>
            {authError && !successMessage && (
              <motion.div
                variants={alertVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
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
                variants={alertVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <Alert
                  severity='success'
                  icon={<CheckCircle size={20} />}
                  sx={{ width: '100%' }}
                >
                  {successMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {!successMessage && (
            <>
              <AuthFormField
                name='newPassword'
                label='New Password'
                value={newPassword}
                onChange={handleInputChange(setNewPassword, 'newPassword')}
                isLoading={isSubmitting}
                startIcon={Shield}
                isPassword={true}
                showPassword={showNewPassword}
                onPasswordVisibilityToggle={() =>
                  setShowNewPassword(!showNewPassword)
                }
                fieldError={formErrors.newPassword}
                autoComplete='new-password'
                autoFocus
              />

              <AuthFormField
                name='confirmPassword'
                label='Confirm New Password'
                value={confirmPassword}
                onChange={handleInputChange(
                  setConfirmPassword,
                  'confirmPassword'
                )}
                isLoading={isSubmitting}
                startIcon={Shield}
                isPassword={true}
                showPassword={showConfirmPassword}
                onPasswordVisibilityToggle={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                fieldError={formErrors.confirmPassword}
                autoComplete='new-password'
              />

              <Box component={motion.div} sx={{ mt: 2 }}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={isSubmitting}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>

        {successMessage && (
          <Typography
            variant='body2'
            sx={{
              textAlign: 'center',
              mt: 3,
              color: theme.palette.text.secondary,
            }}
          >
            Redirecting to sign in... or{' '}
            <MuiLink
              component={Link}
              href='/auth/signin'
              sx={{ fontWeight: 'medium' }}
            >
              Sign In Now
            </MuiLink>
          </Typography>
        )}
      </Box>
    </Container>
  );
}
