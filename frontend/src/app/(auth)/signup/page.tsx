// src/app/(auth)/signup/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  // Alert, // No longer needed here if Snackbar handles all feedback
  IconButton,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { User, Shield, Mail, UserCheck, X } from 'lucide-react';
import { motion } from 'framer-motion'; // AnimatePresence might not be needed if inline alert is removed

import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar'; // <-- Import global snackbar hook
import { AuthFormField } from '@/features/authentication/components/AuthFormField';
import { SignupRequestPayload } from '@/features/authentication/types/auth';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpPage() {
  const theme = useTheme();
  const router = useRouter();
  const {
    signup,
    isLoading,
    isAuthenticated,
    isInitializing: authIsInitializing,
    error: authError, // We'll use this to trigger the snackbar
    clearError, // To clear the error in AuthContext after showing snackbar
  } = useAuth();
  const { showSnackbar } = useSnackbar(); // <-- Initialize global snackbar hook

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!authIsInitializing && isAuthenticated) {
      router.push('/'); // Redirect if already logged in
    }
  }, [isAuthenticated, authIsInitializing, router]);

  // useEffect to display authError from context via Snackbar
  useEffect(() => {
    if (authError) {
      showSnackbar(authError, 'error');
      clearError(); // Clear the error in AuthContext once it's shown
    }
  }, [authError, showSnackbar, clearError]);

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
      // If authError was set from a previous submission, clear it when user types
      if (authError) {
        clearError();
      }
    };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required.';
    if (!lastName.trim()) errors.lastName = 'Last name is required.';
    if (!username.trim()) errors.username = 'Username is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = 'Email address is invalid.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6)
      errors.password = 'Password must be at least 6 characters.';
    if (!confirmPassword)
      errors.confirmPassword = 'Confirm password is required.';
    else if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // clearError(); // Already handled by input change or useEffect for authError
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    const payload: SignupRequestPayload = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    const success = await signup(payload); // signup from useAuth now handles isLoading and authError

    if (success) {
      showSnackbar('Sign up successful! Please proceed to sign in.', 'success');
      // Optionally clear form fields
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/auth/signin'); // Redirect to sign-in page
      }, 2000); // Delay to let user see snackbar
    }
    // If !success, the useEffect listening to authError will trigger the error snackbar
  };

  if (authIsInitializing) {
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
        <Typography variant='h6'>Loading...</Typography>
      </Box>
    );
  }

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
      <Box // Main Card
        sx={{
          position: 'relative',
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
          // maxHeight: { xs: '95vh', sm: '90vh' },
          // overflowY: 'auto',
        }}
      >
        <IconButton
          aria-label='close and go to sign in'
          onClick={() => router.push('/auth/signin')}
          sx={{
            position: 'absolute',
            right: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
            top: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
            backgroundColor: alpha(theme.palette.action.active, 0.04),
            color: theme.palette.text.secondary,
            transition:
              'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
            width: { xs: 32, sm: 36 },
            height: { xs: 32, sm: 36 },
            zIndex: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
            },
          }}
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 3, mt: { xs: 4, sm: 0 } }}>
          <Typography
            variant='h4'
            component='h1'
            sx={{ mb: 0.5, fontWeight: 'bold' }}
          >
            Create Account
          </Typography>
          <Typography
            variant='body2'
            display='block'
            sx={{ color: theme.palette.text.secondary }}
          >
            Join User managerment today!
          </Typography>
        </Box>

        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* The inline AnimatePresence and Alert for authError is removed. Snackbar handles it now. */}

          <AuthFormField
            name='firstName'
            label='First Name'
            value={firstName}
            onChange={handleInputChange(setFirstName, 'firstName')}
            isLoading={isLoading}
            startIcon={User}
            fieldError={formErrors.firstName}
            autoComplete='given-name'
            autoFocus
            type='text'
          />
          <AuthFormField
            name='lastName'
            label='Last Name'
            value={lastName}
            onChange={handleInputChange(setLastName, 'lastName')}
            isLoading={isLoading}
            startIcon={User}
            fieldError={formErrors.lastName}
            autoComplete='family-name'
            type='text'
          />
          <AuthFormField
            name='username'
            label='Username'
            value={username}
            onChange={handleInputChange(setUsername, 'username')}
            isLoading={isLoading}
            startIcon={UserCheck}
            fieldError={formErrors.username}
            autoComplete='username'
            type='text'
          />
          <AuthFormField
            name='email'
            label='Email Address'
            value={email}
            onChange={handleInputChange(setEmail, 'email')}
            isLoading={isLoading}
            startIcon={Mail}
            fieldError={formErrors.email}
            autoComplete='email'
            type='email'
          />
          <AuthFormField
            name='password'
            label='Password'
            value={password}
            onChange={handleInputChange(setPassword, 'password')}
            isLoading={isLoading}
            startIcon={Shield}
            isPassword={true}
            showPassword={showPassword}
            onPasswordVisibilityToggle={() => setShowPassword(!showPassword)}
            fieldError={formErrors.password}
            autoComplete='new-password'
          />
          <AuthFormField
            name='confirmPassword'
            label='Confirm Password'
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
            isLoading={isLoading}
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
              disabled={isLoading} //isLoading from useAuth() should reflect the signup process
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                'Sign Up'
              )}
            </Button>
          </Box>
        </Box>

        <Typography
          component={motion.div}
          variant='body2'
          sx={{
            textAlign: 'center',
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Already have an account?{' '}
          <MuiLink
            component={Link}
            href='/auth/signin'
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
