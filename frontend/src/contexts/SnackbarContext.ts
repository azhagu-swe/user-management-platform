import { createContext } from 'react';
import { AlertColor } from '@mui/material/Alert'; // MUI's type for severity

export interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

// Default function does nothing, actual implementation will be in the provider
const defaultSnackbarContext: SnackbarContextType = {
  showSnackbar: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('SnackbarContext: showSnackbar called before SnackbarProvider mounted or outside its scope.');
    }
  },
};

export const SnackbarContext = createContext<SnackbarContextType>(defaultSnackbarContext);