// src/features/permission-management/components/DeletePermissionDialog.tsx
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

interface DeletePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  permissionName?: string;
}

export default function DeletePermissionDialog({
  open,
  onClose,
  onConfirm,
  permissionName,
}: DeletePermissionDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-permission-dialog-title">
      <DialogTitle id="delete-permission-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the permission:{" "}
          <Typography component="span" fontWeight="bold" color="primary.main">
            {permissionName || 'this permission'}
          </Typography>
          ? This might affect roles that currently use this permission.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}