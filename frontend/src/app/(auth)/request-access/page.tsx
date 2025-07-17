'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField, // Using TextField for most, MuiTelInput for phone
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { User, Building2, Mail as MailIcon, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MuiTelInput,
  /* MuiTelInputInfo */ matchIsValidTel,
} from 'mui-tel-input';

import axios from 'axios';
import { RequestAccessPayload } from '@/features/authentication/types/auth';
import { callRequestAccessApi } from '@/features/authentication/services/auth';

interface FormErrors {
  fullName?: string;
  companyName?: string;
  companyEmail?: string;
  linkedInUrl?: string;
  phoneNumber?: string;
}

// Animation variants for alerts
const alertVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function RequestAccessPage() {
  const theme = useTheme();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [phoneInfo, setPhoneInfo] = useState<MuiTelInputInfo | null>(null); // To store country code etc.

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: keyof FormErrors
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Adjusted for TextField
      setter(e.target.value);
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (submitError) setSubmitError(null);
      if (successMessage) setSuccessMessage(null);
    };

  const handlePhoneInputChange = (
    newPhoneValue: string
    // info: MuiTelInputInfo
  ) => {
    setPhoneNumber(newPhoneValue);
    // setPhoneInfo(info);
    if (formErrors.phoneNumber) {
      setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
    if (submitError) setSubmitError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!companyName.trim()) errors.companyName = 'Company name is required.';
    if (!companyEmail.trim()) {
      errors.companyEmail = 'Company email is required.';
    } else if (!/\S+@\S+\.\S+/.test(companyEmail)) {
      errors.companyEmail = 'Invalid email address.';
    }
    if (
      linkedInUrl.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedInUrl.trim())
    ) {
      errors.linkedInUrl = 'Please enter a valid LinkedIn profile URL.';
    }

    // START: Corrected Phone Number Validation
    if (!phoneNumber.trim()) {
      // Check if the input string is empty
      errors.phoneNumber = 'Phone number is required.';
    } else if (!matchIsValidTel(phoneNumber)) {
      // Use matchIsValidTel
      errors.phoneNumber = 'Please enter a valid phone number.';
    }
    // END: Corrected Phone Number Validation

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const payload: RequestAccessPayload = {
      fullName,
      companyName,
      companyEmail,
      linkedInUrl: linkedInUrl.trim() || undefined, // Send undefined if empty
      phoneNumber, // Full international number string
      // countryCode: phoneInfo?.countryCode,
    };

    try {
      await callRequestAccessApi(payload);
      setSuccessMessage(
        'Thank you for your request! We will review your application and get back to you shortly.'
      );
      // Clear form
      setFullName('');
      setCompanyName('');
      setCompanyEmail('');
      setLinkedInUrl('');
      setPhoneNumber('');
      // setPhoneInfo(null);
    } catch (err: unknown) {
      let errorMessage = 'Failed to submit request. Please try again later.';
      if (axios.isAxiosError(err)) {
        const apiErrorMessage = (err.response?.data as { message?: string })
          ?.message;
        if (typeof apiErrorMessage === 'string') {
          errorMessage = apiErrorMessage;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth='sm' // Using 'sm' for a slightly wider form than 'xs' login
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4, md: 5 },
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant='h4'
            component='h1'
            sx={{ mb: 1, fontWeight: 'bold' }}
          >
            Request Access to User managerment
          </Typography>
          <Typography
            variant='body1' // Slightly larger for better readability
            display='block'
            sx={{ color: theme.palette.text.secondary }}
          >
            {`Fill out the form below and we'll get back to you as soon as
            possible.`}
          </Typography>
        </Box>

        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} // Consistent gap
        >
          <AnimatePresence>
            {submitError && !successMessage && (
              <motion.div
                variants={alertVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <Alert
                  severity='error'
                  sx={{ width: '100%' }}
                  onClose={() => setSubmitError(null)}
                >
                  {submitError}
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
                <Alert severity='success' sx={{ width: '100%' }}>
                  {successMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form fields - Hide form on success */}
          {!successMessage && (
            <>
              <TextField
                label='Full Name'
                variant='outlined'
                fullWidth
                value={fullName}
                onChange={handleInputChange(setFullName, 'fullName')}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                InputProps={{
                  startAdornment: (
                    <User
                      size={20}
                      style={{
                        marginRight: 8,
                        color: theme.palette.action.active,
                      }}
                    />
                  ),
                }}
                disabled={isLoading}
              />
              <TextField
                label='Company Name'
                variant='outlined'
                fullWidth
                value={companyName}
                onChange={handleInputChange(setCompanyName, 'companyName')}
                error={!!formErrors.companyName}
                helperText={formErrors.companyName}
                InputProps={{
                  startAdornment: (
                    <Building2
                      size={20}
                      style={{
                        marginRight: 8,
                        color: theme.palette.action.active,
                      }}
                    />
                  ),
                }}
                disabled={isLoading}
              />
              <TextField
                label='Company Email'
                type='email'
                variant='outlined'
                fullWidth
                value={companyEmail}
                onChange={handleInputChange(setCompanyEmail, 'companyEmail')}
                error={!!formErrors.companyEmail}
                helperText={formErrors.companyEmail}
                InputProps={{
                  startAdornment: (
                    <MailIcon
                      size={20}
                      style={{
                        marginRight: 8,
                        color: theme.palette.action.active,
                      }}
                    />
                  ),
                }}
                disabled={isLoading}
              />
              <MuiTelInput
                label='Phone Number'
                value={phoneNumber}
                onChange={handlePhoneInputChange}
                fullWidth
                variant='outlined'
                defaultCountry='AE' // <-- Set default country to UAE (ISO code)
                // langOfCountryName='ar' // <-- Set language of country names to Arabic
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                disabled={isLoading}
                sx={{
                  // Example: If you need to adjust the default flag container specifically
                  '.MuiInputAdornment-root.MuiInputAdornment-positionStart': {
                    mr: 0,
                  },
                }}
              />
              <TextField
                label='LinkedIn Profile URL (Optional)'
                type='url'
                variant='outlined'
                fullWidth
                value={linkedInUrl}
                onChange={handleInputChange(setLinkedInUrl, 'linkedInUrl')}
                error={!!formErrors.linkedInUrl}
                helperText={formErrors.linkedInUrl}
                InputProps={{
                  startAdornment: (
                    <Linkedin
                      size={20}
                      style={{
                        marginRight: 8,
                        color: theme.palette.action.active,
                      }}
                    />
                  ),
                }}
                disabled={isLoading}
              />

              <Box component={motion.div} sx={{ mt: 2.5 }}>
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
                    'Submit Request'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Footer Link */}
        <Typography
          component={motion.div}
          variant='body2'
          sx={{
            textAlign: 'center',
            mt: 4,
            color: theme.palette.text.secondary,
          }}
        >
          Already have access?{' '}
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
