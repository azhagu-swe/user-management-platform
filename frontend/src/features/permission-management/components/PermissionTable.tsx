// src/features/permission-management/components/PermissionTable.tsx
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
  Tooltip,
  Box,
  CircularProgress,
  Typography,
  Stack,
  alpha,
  useTheme,
  Collapse,
  TablePagination, // For expandable description
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Permission } from '../types/permissionTypes';
import { deletePermission } from '../services/permissionService';
import DeletePermissionDialog from './DeletePermissionDialog';
import { useSnackbar } from '@/hooks/useSnackbar';

// Update the props interface
interface PermissionTableProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
  onDeleteSuccess: (permissionId: number) => void;
  isLoading?: boolean;
  // --- Add Pagination Props ---
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

// Row component to allow for expandable description
const PermissionRow = ({
  permission,
  onEdit,
  onOpenDeleteDialog,
  cellPadding,
}: {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onOpenDeleteDialog: (permission: Permission) => void;
  cellPadding: object;
}) => {
  const theme = useTheme();
  const [openDescription, setOpenDescription] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': { borderBottom: 'unset' }, // Remove default bottom border if using collapsible rows
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <TableCell sx={{ ...cellPadding, width: '5%' }}>
          {permission.description && ( // Show expand icon only if description exists
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpenDescription(!openDescription)}
            >
              {openDescription ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell
          sx={{
            ...cellPadding,
            width: '15%',
            display: { xs: 'none', md: 'table-cell' },
          }}
        >
          {' '}
          {/* Hide ID on small screens */}
          <Typography variant='subtitle1' fontWeight={500} color='text.primary'>
            {permission.id}
          </Typography>
        </TableCell>
        <TableCell
          component='th'
          scope='row'
          sx={{ ...cellPadding, width: '35%' }}
        >
          <Typography variant='subtitle1' fontWeight={500} color='text.primary'>
            {permission.name}
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            ID: {permission.id}
          </Typography>
        </TableCell>

        <TableCell
          align='right'
          sx={{ ...cellPadding, width: '15%', pr: { xs: 1, sm: 2 } }}
        >
          <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
            <Tooltip title='Edit Permission'>
              <IconButton
                onClick={() => onEdit(permission)}
                size='small'
                color='primary'
                aria-label={`edit permission ${permission.name}`}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Permission'>
              <IconButton
                onClick={() => onOpenDeleteDialog(permission)}
                size='small'
                color='error'
                aria-label={`delete permission ${permission.name}`}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      {/* Collapsible row for description */}
      {permission.description && (
        <TableRow
          sx={{ backgroundColor: alpha(theme.palette.action.hover, 0.5) }}
        >
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            {' '}
            {/* Span all columns */}
            <Collapse in={openDescription} timeout='auto' unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  p: 2,
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                }}
              >
                <Typography
                  variant='subtitle2'
                  gutterBottom
                  component='div'
                  fontWeight='bold'
                >
                  Description:
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {permission.description}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default function PermissionTable({
  permissions,
  onEdit,
  onDeleteSuccess,
  isLoading,
  // --- Destructure Pagination Props ---
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
}: PermissionTableProps) {
  
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

    const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handleOpenDeleteDialog = (permission: Permission) => {
    setPermissionToDelete(permission);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setPermissionToDelete(null);
    setOpenDeleteDialog(false);
  };
  console.log(permissions,'permissions')

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return;
    setIsDeleting(true);
    try {
      await deletePermission(permissionToDelete.id);
      showSnackbar(
        `Permission "${permissionToDelete.name}" deleted successfully.`,
        'success'
      );
      onDeleteSuccess(permissionToDelete.id);
    } catch (error) {
      showSnackbar(
        (error as Error).message || 'Failed to delete permission.',
        'error'
      );
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const cellPadding = { py: 1.5, px: 2 };
  const headerCellPadding = { py: 1, px: 2 };

  if (isLoading && permissions.length === 0) {
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
        <Typography variant='body1' sx={{ ml: 2 }}>
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  if (permissions.length === 0 && !isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant='h6' color='text.secondary' gutterBottom>
          No Permissions Found
        </Typography>
        <Typography variant='body2' color='text.disabled'>
          You can start by adding a new permission.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        variant='outlined'
        sx={{ borderRadius: 2, mt: 2 }}
      >
        <Table aria-label='permissions table' stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.grey[500], 0.12), // Neutral header
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell sx={{ ...headerCellPadding, width: '5%' }} />{' '}
              {/* For expand icon */}
             
              <TableCell
                sx={{
                  ...headerCellPadding,
                  width: '15%',
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                ID
              </TableCell>
               <TableCell sx={{ ...headerCellPadding, width: '35%' }}>
                Permission Name
              </TableCell>
              <TableCell
                align='right'
                sx={{
                  ...headerCellPadding,
                  width: '15%',
                  pr: { xs: 1, sm: 2 },
                }}
              >
                Actions
              </TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <PermissionRow
                key={permission.id}
                permission={permission}
                onEdit={onEdit}
                onOpenDeleteDialog={handleOpenDeleteDialog}
                cellPadding={cellPadding}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalElements > 0 && ( // Only show pagination if there are items
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalElements} // Use totalElements from props
          rowsPerPage={rowsPerPage} // Use rowsPerPage from props
          page={page} // Use page from props
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        />
      )}
      {permissionToDelete && (
        <DeletePermissionDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          permissionName={permissionToDelete.name}
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
            Deleting permission...
          </Typography>
        </Box>
      )}
    </>
  );
}
