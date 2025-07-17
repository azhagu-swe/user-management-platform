// src/providers/SnackbarProvider.tsx
'use client';

import React, {
  useState,
  ReactNode,
  useCallback,
  useMemo,
  // Removed useContext from here as it's for the hook, not the provider itself
} from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';
import {
  SnackbarContext,
  SnackbarContextType,
} from '@/contexts/SnackbarContext'; // Ensure this path is correct
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  key: number; // To allow showing same message consecutively
}

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info', // Default severity
    key: 0,
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = 'info') => {
      setSnackbar({
        open: true,
        message,
        severity,
        key: new Date().getTime(), // Use timestamp as key to re-trigger if message is same
      });
    },
    [] // Empty dependency array as this function doesn't depend on external state/props
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue: SnackbarContextType = useMemo(
    () => ({
      showSnackbar,
    }),
    [showSnackbar] // Dependency array includes showSnackbar
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        key={snackbar.key}
        open={snackbar.open}
        autoHideDuration={6000} // Default: 6 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
       
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant='standard'
          sx={{ width: '100%' }}
          elevation={6}
          iconMapping={{
            // Or just the `icon` prop if you want one icon for all
            success: <CheckCircle size={22} />, // Adjust size as needed
            error: <XCircle size={22} />,
            warning: <AlertTriangle size={22} />,
            info: <Info size={22} />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
