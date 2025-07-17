// src/components/shared/PlaceholderCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { HelpCircle } from 'lucide-react'; // Example icon usage

interface PlaceholderCardProps {
  title: string;
}

export function PlaceholderCard({ title }: PlaceholderCardProps) {
  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          <HelpCircle
            size={16}
            style={{ marginRight: 8, verticalAlign: 'middle' }}
          />
          Placeholder Component
        </Typography>
        <Typography variant='h5' component='div'>
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Content goes here
        </Typography>
      </CardContent>
    </Card>
  );
}
