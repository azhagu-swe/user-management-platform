// src/app/(auth)/signin/page.tsx (Correct location for this page)
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Next.js Link
import MuiLink from '@mui/material/Link'; // MUI Link for styling
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Shield, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthFormField } from '@/features/authentication/components/AuthFormField';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SigninPage() {
  const theme = useTheme();
  const router = useRouter();
  const {
    signin,
    isLoading,
    isInitializing,
    error: authError,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { showSnackbar } = useSnackbar(); // <-- Use the hook

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
      if (authError) {
        clearError();
      }
    };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    if (authError) {
      showSnackbar(authError, 'error'); // <-- Trigger global Snackbar
      // Optionally clear the error from AuthContext after showing it,
      // or let the user dismiss it (SnackbarProvider doesn't auto-clear context errors)
      // clearError(); // If you want to clear it immediately after showing
    }
  }, [authError, showSnackbar, clearError]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authError) clearError();
    setFormErrors({});

    if (!validateForm()) {
      return;
    }
    // Pass rememberMe to your login function if it accepts it
    const success = await signin(email, password, rememberMe);

    if (success) {
      showSnackbar('Signed in successfully! Redirecting...', 'success');
      // TODO: Redirect to a more appropriate page, e.g., dashboard or intended URL
      router.push('/');
    }
  };

  if (isInitializing) {
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
        <Typography variant='h6'>Loading Session...</Typography>
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
        py: { xs: 2, sm: 4 }, // Responsive vertical padding
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: { xs: 2.5, sm: 4 }, // Slightly adjusted responsive padding
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
            sx={{ mb: 0.5, fontWeight: 'bold' }}
          >
            User managerment
          </Typography>
          <Typography
            variant='body2'
            display='block'
            sx={{
              color: theme.palette.text.secondary,
              letterSpacing: '0.05em',
              mb: 2.5,
            }}
          >
            Curate, Visualize, Activate
          </Typography>
          <Button
            component={Link}
            href='/request-access' // Adjusted path to be within /auth group
            fullWidth
            variant='outlined'
            size='large'
            sx={{ borderRadius: 2 }}
          >
            Request Access
          </Button>
        </Box>

        {/* Sign In Form */}
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <AnimatePresence>
            {authError && (
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
          </AnimatePresence>

          <AuthFormField
            name='email'
            label='Email Address'
            value={email}
            onChange={handleInputChange(setEmail, 'email')}
            isLoading={isLoading}
            startIcon={Mail}
            fieldError={formErrors.email}
            autoComplete='email'
            autoFocus
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
            onPasswordVisibilityToggle={handlePasswordVisibility}
            fieldError={formErrors.password}
            autoComplete='current-password'
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack on extra-small screens
              justifyContent: { sm: 'space-between' }, // Space between only on larger screens
              alignItems: { xs: 'flex-start', sm: 'center' }, // Align appropriately
              mt: 0.5,
              gap: { xs: 1, sm: 0 },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  name='rememberMe'
                  color='primary'
                  size='small'
                />
              }
              label={
                <Typography
                  variant='body2'
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Remember me
                </Typography>
              }
            />
            <MuiLink
              component={Link}
              href='/forgot-password' // Adjusted path to be within /auth group
              variant='body2'
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'medium',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                // Ensures it doesn't stretch full width if stacked and FormControlLabel does
                width: { xs: 'auto', sm: 'auto' },
              }}
            >
              Forgot password?
            </MuiLink>
          </Box>
          {/* --- END OF MODIFICATION --- */}

          {/* Submit Button */}
          <Box component={motion.div} sx={{ mt: 2 }}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isLoading || isInitializing}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                'Sign in'
              )}
            </Button>
          </Box>
        </Box>

        {/* Footer Link */}
        <Typography
          component={motion.div}
          variant='body2'
          sx={{
            textAlign: 'center',
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          {`Don't have an account?`}{' '}
          <MuiLink
            component={Link}
            href='/signup' // Adjusted path
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'medium',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Request Access
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}
