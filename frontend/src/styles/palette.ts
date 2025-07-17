// src/styles/palettes.ts
import { PaletteOptions } from '@mui/material/styles';

// --- Define Your Brand Colors ---
const PRIMARY_MAIN = '#007AFF';
const PRIMARY_LIGHT = '#66B2FF';
const PRIMARY_DARK = '#0052CC';

const SECONDARY_MAIN = '#E91E63';
const SECONDARY_LIGHT = '#FF6090';
const SECONDARY_DARK = '#B0003A';

const ERROR_MAIN = '#F44336';
const WARNING_MAIN = '#FFA726';
const INFO_MAIN = '#29B6F6';
const SUCCESS_MAIN = '#66BB6A';
// --- End Brand Colors ---

// Palette for Light Mode
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: PRIMARY_MAIN,
    light: PRIMARY_LIGHT,
    dark: PRIMARY_DARK,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: SECONDARY_MAIN,
    light: SECONDARY_LIGHT,
    dark: SECONDARY_DARK,
    contrastText: '#FFFFFF',
  },
  error: { main: ERROR_MAIN },
  warning: { main: WARNING_MAIN },
  info: { main: INFO_MAIN },
  success: { main: SUCCESS_MAIN },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Palette for Dark Mode
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: PRIMARY_LIGHT,
    light: '#A0CFFF',
    dark: PRIMARY_MAIN,
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: SECONDARY_LIGHT,
    light: '#FF94B8',
    dark: SECONDARY_MAIN,
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  error: { main: ERROR_MAIN }, 
  warning: { main: WARNING_MAIN },
  info: { main: INFO_MAIN },
  success: { main: SUCCESS_MAIN },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};