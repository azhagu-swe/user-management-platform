// src/app/(app)/privacy-policy/page.tsx
import React from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import { ShieldCheck } from 'lucide-react'; // Icon for privacy

// This is a Server Component by default
export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 5 } }}>
      {' '}
      {/* Use Container for consistent width */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
        {/* Header/Dialog */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ShieldCheck size={32} color='primary.main' />
          <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
            Privacy Policy
          </Typography>
        </Box>
        <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 3 }}>
          {`Your trust and data privacy are important. Here's how we collect, use,
          and protect your information when you use the CodeMaster platform.`}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* --- !! IMPORTANT: REPLACE PLACEHOLDER CONTENT BELOW WITH YOUR ACTUAL PRIVACY POLICY !! --- */}
        <Box
          sx={{
            '& h5': { mt: 3, mb: 1, fontWeight: 600 },
            '& p': { mb: 2, lineHeight: 1.7 },
          }}
        >
          <Typography variant='body1' paragraph>
            Last Updated: March 28, 2025 {/* Update this date */}
          </Typography>

          <Typography variant='h5' component='h2'>
            1. Information We Collect
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Describe the types of personal information you collect
            (e.g., name, email, password hashes, usage data, payment info if
            applicable). Explain *how* you collect it (e.g., during signup,
            profile updates, usage tracking).
          </Typography>

          <Typography variant='h5' component='h2'>
            2. How We Use Your Information
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Explain the purposes for collecting data (e.g.,
            providing service, authentication, communication, personalization,
            analytics, payment processing). Be specific.
          </Typography>

          <Typography variant='h5' component='h2'>
            3. Data Sharing and Disclosure
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Explain if and with whom you share data (e.g.,
            third-party service providers like hosting, analytics, payment
            processors). State the conditions for sharing (e.g., legal
            requirements, user consent).
          </Typography>

          <Typography variant='h5' component='h2'>
            4. Data Security
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Describe the security measures you take to protect user
            data (e.g., encryption, access controls). Acknowledge that no system
            is 100% secure.
          </Typography>

          <Typography variant='h5' component='h2'>
            5. User Rights
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Explain user rights regarding their data (e.g., access,
            correction, deletion, objection) and how they can exercise these
            rights (e.g., via account settings or contacting support). Mention
            specific rights under GDPR/CCPA if applicable.
          </Typography>

          <Typography variant='h5' component='h2'>
            6. Cookies and Tracking Technologies
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Explain your use of cookies (session, persistent,
            analytics, etc.) and similar technologies. Link to a separate Cookie
            Policy if necessary.
          </Typography>

          <Typography variant='h5' component='h2'>
            7. Changes to This Policy
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: State that the policy may be updated and how users will
            be notified.
          </Typography>

          <Typography variant='h5' component='h2'>
            8. Contact Us
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Provide contact information (email or link to contact
            page) for privacy-related inquiries.
          </Typography>
        </Box>
        {/* --- END PLACEHOLDER CONTENT --- */}
      </Paper>
    </Container>
  );
}
