'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

interface DeleteRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName?: string;
}

export default function DeleteRoleDialog({
  open,
  onClose,
  onConfirm,
  roleName,
}: DeleteRoleDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='delete-role-dialog-title'
    >
      <DialogTitle id='delete-role-dialog-title'>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the role:{' '}
          <Typography component='span' fontWeight='bold'>
            {roleName || 'this role'}
          </Typography>
          ? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color='inherit'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained' autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
