// src/features/role-management/components/RoleTable.tsx
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
  Stack, // For better spacing of action icons
  alpha, // For transparent colors
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // To access theme palette
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility'; // Example for a "View Details" icon
import { Role } from '../types/roleTypes';
import { deleteRole } from '../services/roleService';
import DeleteRoleDialog from './DeleteRoleDialog';
import { useSnackbar } from '@/hooks/useSnackbar';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDeleteSuccess: (roleId: number) => void;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  isLoading?: boolean;
}

export default function RoleTable({
  roles,
  onEdit,
  onDeleteSuccess,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  isLoading,
}: RoleTableProps) {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setRoleToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRole(roleToDelete.id);
      showSnackbar(
        `Role "${roleToDelete.name}" deleted successfully.`,
        'success'
      );
      onDeleteSuccess(roleToDelete.id);
    } catch (error) {
      showSnackbar(
        (error as Error).message || 'Failed to delete role.',
        'error'
      );
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const cellPadding = { py: 1.5, px: 2 }; // Consistent cell padding

  return (
    <>
      <TableContainer
        component={Paper}
        variant='outlined' // Use outlined variant for a cleaner look than default elevation
        sx={{
          boxShadow: 'none', // Already good
          border: (theme) => `1px solid ${theme.palette.divider}`, // Already good
          borderRadius: 2, // Match parent Paper's borderRadius if desired
        }}
      >
        <Table aria-label='roles table' stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                // More distinct header styling
                '& .MuiTableCell-head': {
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.primary.light, 0.1), // Subtle primary color tint
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <TableCell sx={cellPadding}>Role Name</TableCell>
              <TableCell sx={cellPadding}>Permissions</TableCell>
              <TableCell align='right' sx={{ ...cellPadding, pr: 3 }}>
                {' '}
                {/* Extra padding for actions */}
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align='center' sx={{ py: 5 }}>
                  <CircularProgress />
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Loading roles...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align='center' sx={{ py: 5 }}>
                  <Typography variant='body1' color='text.secondary'>
                    No roles found.
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    Try creating a new role to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04), // Subtle hover
                    },
                  }}
                >
                  <TableCell component='th' scope='row' sx={cellPadding}>
                    <Typography
                      variant='subtitle1'
                      fontWeight={500}
                      color='text.primary'
                    >
                      {role.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={cellPadding}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.75, // Slightly more gap for chips
                        // maxWidth: 400, // Prevent extremely wide cell for many permissions
                      }}
                    >
                      {role.permissions && role.permissions.length > 0 ? (
                        role.permissions.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size='small'
                            sx={(theme) => ({
                              fontWeight: 'bold',
                              borderRadius: '6px', 
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.dark,

                              ...(theme.palette.mode === 'dark' && {
                                backgroundColor: alpha(
                                  theme.palette.primary.light,
                                  0.15
                                ),
                                color: theme.palette.primary.light,
                              }),
                            })}
                          />
                        ))
                      ) : (
                        <Typography
                          variant='caption'
                          fontStyle='italic'
                          color='text.disabled'
                        >
                          No permissions assigned
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align='right' sx={{ ...cellPadding, pr: 2 }}>
                    <Stack
                      direction='row'
                      spacing={0.5}
                      justifyContent='flex-end'
                    >
                      <Tooltip title='Edit Role'>
                        <IconButton
                          onClick={() => onEdit(role)}
                          size='small'
                          color='primary'
                          aria-label={`edit role ${role.name}`}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete Role'>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(role)}
                          size='small'
                          color='error'
                          aria-label={`delete role ${role.name}`}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      {/* Example: Add a View Details icon if applicable */}
                      {/* <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => console.log('View', role.id)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {roles.length > 0 && ( // Only show pagination if there are roles
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]} // Added 50
          component='div'
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            mt: 0,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        />
      )}
      {roleToDelete && (
        <DeleteRoleDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          roleName={roleToDelete.name}
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
          <Typography variant='body2' sx={{ ml: 1.5 }}>
            Deleting role...
          </Typography>
        </Box>
      )}
    </>
  );
}
