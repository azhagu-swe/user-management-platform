// src/app/page.tsx
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

// Import the components
import MarketingNavbar from '@/components/layout/MarketingNavbar';
import HeroSection from '@/features/landing-page/components/HeroSection';
// import Footer from '@/components/layout/Footer';
// You would also import other sections here like FeatureSection, Testimonials, etc.

// Example placeholder for another section
const OtherSection = ({ title }: { title: string }) => (
  <Box sx={{ py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
    <Typography variant="h3">{title}</Typography>
    <Typography color="text.secondary">Content for this section goes here.</Typography>
  </Box>
);

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: 'background.paper' }}> {/* Main background for the page */}
      <MarketingNavbar />
      <main>
        <HeroSection />
        <Divider />
        <OtherSection title="Feature Showcase Section" />
        <Divider />
        <OtherSection title="Testimonials Section" />
      </main>
      {/* <Footer /> */}
    </Box>
  );
}