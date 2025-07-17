// src/features/user-management/components/UserTable.tsx
'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
  Chip,
  Box,
  CircularProgress,
  Typography,
  Stack,
  alpha,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { User } from '../types/userTypes';
import { deleteUser } from '../services/userService';
import DeleteUserDialog from './DeleteUserDialog';
import { useSnackbar } from '@/hooks/useSnackbar';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDeleteSuccess: (userId: string) => void;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  isLoading?: boolean;
}

// A helper to assign colors to roles for better visual scanning
const roleColorMap: Record<
  string,
  'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
> = {
  SuperAdmin: 'error',
  AccountAdmin: 'warning',
  Manager: 'primary',
  User: 'info',
  // Add other roles as needed
};

// Sub-component for the actions menu to keep the main table clean
const UserActionsMenu = ({
  user,
  onEdit,
  onOpenDeleteDialog,
}: {
  user: User;
  onEdit: (user: User) => void;
  onOpenDeleteDialog: (user: User) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(user);
    handleClose();
  };

  const handleDelete = () => {
    onOpenDeleteDialog(user);
    handleClose();
  };

  return (
    <>
      <Tooltip title="More Actions">
        <IconButton
          aria-label={`more actions for ${user.username}`} // Corrected: More specific aria-label
          id={`actions-button-${user.id}`}
          aria-controls={open ? `actions-menu-${user.id}` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id={`actions-menu-${user.id}`}
        MenuListProps={{ 'aria-labelledby': `actions-button-${user.id}` }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default function UserTable({
  users,
  onEdit,
  onDeleteSuccess,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  isLoading,
}: UserTableProps) {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      showSnackbar(
        `User "${userToDelete.username}" deleted successfully.`,
        'success'
      );
      onDeleteSuccess(userToDelete.id);
    } catch (error) {
      showSnackbar(
        (error as Error).message || 'Failed to delete user.',
        'error'
      );
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  // Corrected: The type for the 'event' parameter is typically not used,
  // but 'unknown' is a safe default if you don't need to access event properties.
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const cellPadding = { py: 1.5, px: 2 };
  const headerCellPadding = { py: 1, px: 2 };

  if (isLoading && users.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 5,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (users.length === 0 && !isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Users Found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adding a new user to the system.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, mt: 2 }}
      >
        <Table aria-label="users table" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.grey[500], 0.08),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell sx={{ ...headerCellPadding, width: '40%' }}>
                User
              </TableCell>
              <TableCell sx={{ ...headerCellPadding, width: '35%' }}>
                Roles
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  ...headerCellPadding,
                  width: '15%',
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  ...headerCellPadding,
                  width: '10%',
                  pr: { xs: 1, sm: 2 },
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <TableCell sx={cellPadding}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        width: 40,
                        height: 40,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={cellPadding}>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap> {/* Changed to useFlexGap */}
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          color={roleColorMap[role] || 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.disabled" fontStyle="italic"> {/* Added italic style */}
                        No roles
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...cellPadding,
                    display: { xs: 'none', sm: 'table-cell' },
                  }}
                >
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ ...cellPadding, pr: 2 }}>
                  <UserActionsMenu
                    user={user}
                    onEdit={onEdit}
                    onOpenDeleteDialog={handleOpenDeleteDialog}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
      />

      {userToDelete && (
        <DeleteUserDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          username={userToDelete.username}
        />
      )}
      {isDeleting && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 2,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ ml: 1.5 }}>
            Deleting user...
          </Typography>
        </Box>
      )}
    </>
  );
}