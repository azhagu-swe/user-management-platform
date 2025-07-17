import { PaletteMode } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { lightPalette,darkPalette } from './palette';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: mode === 'light' ? lightPalette : darkPalette,
  typography: {
    fontFamily: ['"Inter"', '"Helvetica"', '"Arial"', 'sans-serif'].join(','), // Example font stack
    h1: { fontSize: '2.5rem', fontWeight: 700 },
  },
  shape: {
    borderRadius: 8, 
  },
  spacing: 8, 
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20, 
        },
      },
      defaultProps: {
        disableElevation: true, 
      }
    },
    MuiPaper: {
        defaultProps: {
            elevation: 0, 
        },
        styleOverrides: {
            root: {
            }
        }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

export const createAppTheme = (mode: PaletteMode) => {
  let theme = createTheme(getDesignTokens(mode));
  theme = responsiveFontSizes(theme); 
  return theme;
};