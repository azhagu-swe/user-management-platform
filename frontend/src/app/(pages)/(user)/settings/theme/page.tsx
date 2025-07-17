// src/app/(app)/settings/theme/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Container,
  Divider,
} from '@mui/material';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { UserPalettePreferences } from '@/types/theme';
import { useSnackbar } from '@/hooks/useSnackbar';
import ColorPicker from '@/features/theme-customization/components/ColorPicker'; // <-- Import the new component

// --- Curated Color Palettes ---
const primaryColorSwatches = [
  '#007AFF', // Default Blue
  '#5E5CE6', // Indigo
  '#0A84FF', // Bright Blue
  '#34C759', // Green
  '#FF9500', // Orange
  '#AF52DE', // Purple
];

const secondaryColorSwatches = [
  '#E91E63', // Default Pink
  '#FF375F', // Bright Pink/Red
  '#FFD60A', // Yellow/Gold
  '#32D74B', // Mint Green
  '#64D2FF', // Sky Blue
  '#BF5AF2', // Lavender
];

export default function ThemeCustomizationPage() {
  const {
    mode,
    toggleTheme,
    themePreferences,
    saveThemePreferences,
    resetThemePreferences,
  } = useCustomTheme();
  const { showSnackbar } = useSnackbar();

  const [formState, setFormState] = useState<UserPalettePreferences>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialize form with user's saved preferences
    // If no preference is saved for a color, it will be an empty string,
    // allowing the component's UI to show no swatch is selected initially.
    if (themePreferences) {
      setFormState({
        primaryMain: themePreferences.primaryMain || '',
        secondaryMain: themePreferences.secondaryMain || '',
        // You can add your other theme preference fields here (background, text)
      });
    } else {
      setFormState({}); // Start with empty if no preferences are saved at all
    }
  }, [themePreferences]);

  // A single handler to update any color in the form state
  const handleColorChange = (
    field: keyof UserPalettePreferences,
    color: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: color }));
  };

  const handleSave = () => {
    setIsSaving(true);
    saveThemePreferences(formState);
    showSnackbar('Theme preferences saved!', 'success');
    // Add a slight delay to show the saving animation
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleResetToDefaults = () => {
    resetThemePreferences();
    showSnackbar('Theme reset to defaults.', 'info');
    setFormState({}); // Clear local form state
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3}}>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Customize Theme
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Your theme preferences are saved locally in your browser.
                </Typography>
            </Box>
            <FormControlLabel
                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
                label={mode === 'dark' ? "Light Mode" : "Dark Mode"}
            />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid size={{xs:12}}>
            <ColorPicker
              label="Primary Color"
              value={formState.primaryMain || ''}
              onChange={(color) => handleColorChange('primaryMain', color)}
              colorSwatches={primaryColorSwatches}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <ColorPicker
              label="Secondary Color"
              value={formState.secondaryMain || ''}
              onChange={(color) => handleColorChange('secondaryMain', color)}
              colorSwatches={secondaryColorSwatches}
            />
          </Grid>
          {/* Add more ColorPicker components here for background, text, etc. */}
        </Grid>

        <Box sx={{ mt: 5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleSave} disabled={isSaving} size="large">
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Theme'}
          </Button>
          <Button variant="outlined" onClick={handleResetToDefaults} disabled={isSaving} size="large">
            Reset to Defaults
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}