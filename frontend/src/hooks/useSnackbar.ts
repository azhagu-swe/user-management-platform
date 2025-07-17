import { useContext } from 'react';
import { SnackbarContext, SnackbarContextType } from '@/contexts/SnackbarContext'; // Adjust path if needed

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};