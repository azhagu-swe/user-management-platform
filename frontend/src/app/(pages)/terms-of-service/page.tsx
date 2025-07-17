// src/app/(app)/terms-of-service/page.tsx
import React from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import { ScrollText } from 'lucide-react'; // Icon for terms/documents

// This is a Server Component by default
export default function TermsOfServicePage() {
  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 5 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
        {/* Header/Dialog */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ScrollText size={32} color='primary.main' />
          <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
            Terms of Service
          </Typography>
        </Box>
        <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 3 }}>
          {` The ground rules for using the CodeMaster platform. Please read these
          carefully - they're like the project's README! 📜`}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* --- !! IMPORTANT: REPLACE PLACEHOLDER CONTENT BELOW WITH YOUR ACTUAL TERMS OF SERVICE !! --- */}
        <Box
          sx={{
            '& h5': { mt: 3, mb: 1, fontWeight: 600 },
            '& p, & li': { mb: 2, lineHeight: 1.7 },
          }}
        >
          <Typography variant='body1' paragraph>
            Last Updated: March 28, 2025 {/* Update this date */}
          </Typography>
          <Typography variant='body1' paragraph>
            {`Welcome to CodeMaster! These Terms of Service ("Terms") govern your
            access to and use of our website, content, and services
            (collectively, the "Service"). Please read these Terms carefully.`}
          </Typography>

          <Typography variant='h5' component='h2'>
            1. Acceptance of Terms
          </Typography>
          <Typography variant='body1' paragraph>
            {`Placeholder: State that by accessing or using the Service, users
            agree to be bound by these Terms. If they don't agree, they
            shouldn't use the Service.`}
          </Typography>

          <Typography variant='h5' component='h2'>
            2. User Accounts
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Explain requirements for account creation (age,
            accuracy of information), user responsibilities for account security
            (passwords), and conditions for account termination.
          </Typography>

          <Typography variant='h5' component='h2'>
            3. Use of the Service
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Describe permitted uses of the platform. Outline
            prohibited conduct (e.g., illegal activities, harassment,
            distributing malware, scraping data, infringing intellectual
            property). Mention user-generated content policies if applicable.
          </Typography>

          <Typography variant='h5' component='h2'>
            4. Content and Intellectual Property
          </Typography>
          <Typography variant='body1' paragraph>
            {`Placeholder: Clarify ownership of the platform's content (yours) and user-generated content (if applicable). Grant licenses necessary for the service to operate. Include copyright/DMCA policy information.`}{' '}
          </Typography>

          {/* Add sections for Payment/Subscriptions (if applicable), Disclaimers, Limitation of Liability, Governing Law, Changes to Terms, Contact Info, etc. */}

          <Typography variant='h5' component='h2'>
            5. Disclaimers
          </Typography>
          <Typography variant='body1' paragraph>
            {`Placeholder: Standard disclaimer stating the service is provided "as is" without warranties.`}
          </Typography>

          <Typography variant='h5' component='h2'>
            6. Limitation of Liability
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Limit your liability for damages arising from the use
            of the service, as permitted by law.
          </Typography>

          <Typography variant='h5' component='h2'>
            7. Governing Law
          </Typography>
          <Typography variant='body1' paragraph>
            {` Placeholder: Specify the jurisdiction whose laws govern the terms (e.g., "State of [Your State], India").`}
          </Typography>

          <Typography variant='h5' component='h2'>
            8. Contact Information
          </Typography>
          <Typography variant='body1' paragraph>
            Placeholder: Provide contact details for questions regarding the
            Terms.
          </Typography>
        </Box>
        {/* --- END PLACEHOLDER CONTENT --- */}
      </Paper>
    </Container>
  );
}
