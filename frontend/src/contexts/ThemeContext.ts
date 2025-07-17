// src/contexts/ThemeContext.ts
import { createContext } from 'react';
import { PaletteMode } from '@mui/material';
import { UserPalettePreferences } from '@/types/theme'; // Import our new type

export interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  themePreferences: UserPalettePreferences | null;
  saveThemePreferences: (prefs: UserPalettePreferences) => void;
  resetThemePreferences: () => void;
}

// Default context value with no-op functions
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  themePreferences: null,
  saveThemePreferences: () => {},
  resetThemePreferences: () => {},
});