'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

// Extend TextFieldProps to include our custom props
// Omit TextField's 'error' prop to avoid type conflict if we redefine its meaning or usage
export interface AuthFormFieldProps
  extends Omit<TextFieldProps, 'variant' | 'error'> {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  startIcon?: LucideIcon; // Icon component for the start adornment
  isPassword?: boolean; // To handle password visibility logic
  showPassword?: boolean;
  onPasswordVisibilityToggle?: () => void;
  fieldError?: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export function AuthFormField({
  name,
  label,
  value,
  onChange,
  isLoading = false,
  startIcon: StartIcon,
  isPassword = false,
  showPassword,
  onPasswordVisibilityToggle,
  type,
  fieldError,
  ...rest
}: AuthFormFieldProps) {
  const theme = useTheme();

  return (
    <Box component={motion.div} variants={itemVariants} sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        id={name}
        name={name}
        type={
          isPassword ? (showPassword ? 'text' : 'password') : type || 'text'
        }
        value={value}
        onChange={onChange}
        disabled={isLoading}
        variant='outlined'
        error={!!fieldError}
        helperText={fieldError || ' '}
        InputProps={{
          startAdornment: StartIcon ? (
            <InputAdornment position='start'>
              <StartIcon
                size={20}
                color={
                  fieldError
                    ? theme.palette.error.main
                    : theme.palette.text.secondary
                }
              />
            </InputAdornment>
          ) : undefined,
          endAdornment: isPassword ? ( // Only add password toggle if it's a password field
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={onPasswordVisibilityToggle}
                edge='end'
                sx={{ color: theme.palette.text.secondary }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
          sx: {
            color: theme.palette.text.primary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: fieldError
                ? theme.palette.error.main
                : theme.palette.divider, // Error border color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: fieldError
                ? theme.palette.error.main
                : theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: fieldError
                ? theme.palette.error.main
                : theme.palette.primary.main,
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: fieldError
              ? theme.palette.error.main
              : theme.palette.text.secondary,
          },
        }}
        FormHelperTextProps={{
          sx: {
            minHeight: theme.spacing(2.5), // Reserve space to prevent layout shift
            marginLeft: 0, // Align with TextField if default Mui styles add margin
            marginRight: 0,
            color: fieldError
              ? theme.palette.error.main
              : theme.palette.text.secondary, // Error color for helper text
          },
        }}
        {...rest}
      />
    </Box>
  );
}
