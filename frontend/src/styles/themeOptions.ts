// src/styles/themeOptions.ts
import { ThemeOptions } from '@mui/material/styles';

export const commonThemeOptions: Omit<ThemeOptions, 'palette'> = { // Omit palette as it's mode-specific
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.25 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.4 },
    h6: { fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.45 },
    // You can add more specific overrides for body1, body2, button, caption, etc.
  },
  shape: {
    borderRadius: 8, // Consistent border radius
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Flatter buttons by default
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // More modern button text
          // borderRadius: 20, // Example for more rounded buttons if desired
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Example: make Paper components flat by default
      },
      styleOverrides: {
        root: {
          // backgroundImage: 'none', // Important for some MUI dark mode components if issues arise
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0, // Flat AppBar
        color: 'transparent', // Example: transparent AppBar by default
      },
      styleOverrides: {
        root: {
          // backgroundColor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.8)', // Example for slight transparency
          // backdropFilter: 'blur(8px)',
        }
      }
    }
    // Add more global component overrides here
  },
  // You can also customize spacing, breakpoints, zIndex etc. here if needed globally
  // spacing: 8, // Default
  // breakpoints: { ... }
};