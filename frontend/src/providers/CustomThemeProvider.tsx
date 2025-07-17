// src/providers/CustomThemeProvider.tsx
'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  createTheme,
  Theme,
  PaletteMode,
  responsiveFontSizes,
  PaletteOptions,
  lighten,
  darken,  
} from '@mui/material/styles';
import { ThemeContext } from '@/contexts/ThemeContext';
import { lightPalette as defaultLightPalette, darkPalette as defaultDarkPalette } from '@/styles/palette';
import { commonThemeOptions } from '@/styles/themeOptions';
import { UserPalettePreferences } from '@/types/theme';
import ThemeRegistry from './ThemeRegistry';

// Define keys for localStorage for better maintainability
const THEME_MODE_STORAGE_KEY = 'themeMode';
const THEME_PREFS_STORAGE_KEY = 'themePreferences';

// Create a temporary, minimal theme object to get access to the getContrastText function.
// This is the correct way to use this utility.
const tempThemeForUtils = createTheme();

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');
  const [themePreferences, setThemePreferences] = useState<UserPalettePreferences | null>(null);

  // This useEffect loads the saved settings from localStorage on initial render.
  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) as PaletteMode | null;
      const storedPrefsJson = localStorage.getItem(THEME_PREFS_STORAGE_KEY);
      const storedPrefs = storedPrefsJson ? (JSON.parse(storedPrefsJson) as UserPalettePreferences) : null;
      
      if (storedPrefs) setThemePreferences(storedPrefs);
      
      if (storedMode) {
        setMode(storedMode);
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        setMode(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading theme settings from localStorage:', error);
    }
  }, []);

  // These useCallback hooks define the functions to change the theme.
  const toggleTheme = useCallback(() => { setMode((prev) => { const newMode = prev === 'light' ? 'dark' : 'light'; localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode); return newMode; }); }, []);
  const saveThemePreferences = useCallback((prefs: UserPalettePreferences) => { localStorage.setItem(THEME_PREFS_STORAGE_KEY, JSON.stringify(prefs)); setThemePreferences(prefs); }, []);
  const resetThemePreferences = useCallback(() => { localStorage.removeItem(THEME_PREFS_STORAGE_KEY); setThemePreferences(null); }, []);


  // This is the core logic where the dynamic theme is created.
  const theme: Theme = useMemo(() => {
    // 1. Start with the default palette for the current mode (light or dark)
    const basePaletteForMode = mode === 'light' ? defaultLightPalette : defaultDarkPalette;

    // 2. Create an object for user overrides
    const userOverrides: Partial<PaletteOptions> = {};

    // 3. If custom preferences exist, generate new color objects
    if (themePreferences) {
      const customPrimary = themePreferences.primaryMain;
      const customSecondary = themePreferences.secondaryMain;

      // --- START: Dynamic Color Generation for Primary Color ---
      if (customPrimary) {
        try {
          // Generate a full color object from the user's chosen main color
          userOverrides.primary = {
            main: customPrimary,
            light: lighten(customPrimary, 0.2), // Generate a lighter shade
            dark: darken(customPrimary, 0.15),  // Generate a darker shade for the hover state
            contrastText: tempThemeForUtils.palette.getContrastText(customPrimary), // Calculate readable text color
          };
        } catch (e) {
          console.error("Invalid primary color value for theme generation:", customPrimary, e);
          // If the color is invalid, this override is skipped, and it will fall back to the default.
        }
      }
      // --- END: Dynamic Color Generation for Primary Color ---

      // --- Dynamic Color Generation for Secondary Color ---
      if (customSecondary) {
        try {
          userOverrides.secondary = {
            main: customSecondary,
            light: lighten(customSecondary, 0.2),
            dark: darken(customSecondary, 0.15),
            contrastText: tempThemeForUtils.palette.getContrastText(customSecondary),
          };
        } catch (e) {
          console.error("Invalid secondary color value for theme generation:", customSecondary, e);
        }
      }

      // Merge overrides for background and text as before
      if (themePreferences.backgroundDefault || themePreferences.backgroundPaper) {
        userOverrides.background = { ...basePaletteForMode.background, ...(themePreferences.backgroundDefault && { default: themePreferences.backgroundDefault }), ...(themePreferences.backgroundPaper && { paper: themePreferences.backgroundPaper }) };
      }
      if (themePreferences.textPrimary || themePreferences.textSecondary) {
        userOverrides.text = { ...basePaletteForMode.text, ...(themePreferences.textPrimary && { primary: themePreferences.textPrimary }), ...(themePreferences.textSecondary && { secondary: themePreferences.textSecondary }) };
      }
    }

    // 4. Merge everything to create the final theme options
    const finalPalette: PaletteOptions = {
      ...basePaletteForMode, // The default palette (light or dark)
      ...userOverrides,       // The dynamic user overrides (primary, secondary, etc.)
      mode: mode,             // Ensure the final mode is set
    };

    let newTheme = createTheme({
      ...commonThemeOptions, // Your base typography, shape, etc.
      palette: finalPalette,
    });
    
    newTheme = responsiveFontSizes(newTheme);

    return newTheme;
  }, [mode, themePreferences]); // Re-run this logic when mode or user preferences change


  const contextValue = useMemo(() => ({
    mode,
    toggleTheme,
    themePreferences,
    saveThemePreferences,
    resetThemePreferences,
  }), [mode, toggleTheme, themePreferences, saveThemePreferences, resetThemePreferences]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeRegistry theme={theme}>{children}</ThemeRegistry>
    </ThemeContext.Provider>
  );
};