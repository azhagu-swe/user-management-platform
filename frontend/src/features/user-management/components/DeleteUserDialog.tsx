// src/features/user-management/components/DeleteUserDialog.tsx
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

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username?: string;
}

export default function DeleteUserDialog({
  open,
  onClose,
  onConfirm,
  username,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-user-dialog-title">
      <DialogTitle id="delete-user-dialog-title">Confirm User Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the user:{" "}
          <Typography component="span" fontWeight="bold" color="primary.main">
            {username || 'this user'}
          </Typography>
          ? This action is permanent and cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Delete User
        </Button>
      </DialogActions>
    </Dialog>
  );
}