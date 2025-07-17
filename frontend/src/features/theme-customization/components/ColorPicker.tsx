// src/features/theme-customization/components/ColorPicker.tsx
'use client';

import React, { useRef } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'; // Import 'styled' from MUI
import { Check, Palette } from 'lucide-react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ColorPickerProps {
  label: string;
  value: string; // The currently selected hex color
  onChange: (color: string) => void;
  colorSwatches: string[];
}

export default function ColorPicker({
  label,
  value,
  onChange,
  colorSwatches,
}: ColorPickerProps) {
  const theme = useTheme();
  // The ref now points to the HTMLInputElement, which is correct.
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCustomColorClick = () => {
    // When the IconButton is clicked, programmatically click the hidden input.
    colorInputRef.current?.click();
  };

  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box>
      <Typography gutterBottom variant="subtitle1" fontWeight="medium">
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {colorSwatches.map((color) => {
          const isSelected = value.toLowerCase() === color.toLowerCase();
          return (
            <Tooltip title={color} key={color}>
              <Box
                onClick={() => onChange(color)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                  boxShadow: isSelected ? `0 0 0 2px ${theme.palette.background.paper}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                {isSelected && (
                  <Check
                    size={20}
                    color={theme.palette.getContrastText(color)}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
        
        {/* Custom Color Picker Button */}
        <Tooltip title="Custom Color">
          {/* This IconButton acts as the visible button for the user */}
          <IconButton
            onClick={handleCustomColorClick}
            aria-label="choose custom color"
            sx={{
              width: 36,
              height: 36,
              border: `2px dashed ${theme.palette.divider}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <Palette size={20} />
            <VisuallyHiddenInput
              type="color"
              ref={colorInputRef}
              onChange={handleCustomColorChange}
              value={value} 
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
