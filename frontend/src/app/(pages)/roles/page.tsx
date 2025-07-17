// src/app/(pages)/roles/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Container,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { useTheme } from '@mui/material/styles'; // theme not explicitly used here, but good to have if needed

import { useAuth } from '@/hooks/useAuth'; // Your auth hook
import { Role, Permission } from '@/features/role-management/types/roleTypes';
import {
  getAllRoles,
  getAllPermissionsSearch,
} from '@/features/role-management/services/roleService';
import RoleTable from '@/features/role-management/components/RoleTable';
import RoleFormModal from '@/features/role-management/components/RoleFormModal';
import { useSnackbar } from '@/hooks/useSnackbar';
import Link from 'next/link';

const ALLOWED_ROLES = ['SuperAdmin', 'AccountAdmin']; // Roles allowed to access this page

export default function RoleManagementPage() {
  // const theme = useTheme(); // Uncomment if you use theme directly
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isInitializing: authIsInitializing,
  } = useAuth();

  const [roles, setRoles] = useState<Role[]>([]);
  const [allAvailablePermissions, setAllAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [isLoading, setIsLoading] = useState(true); // For data fetching
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // For page access authorization

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Authorization check effect
  useEffect(() => {
    if (!authIsInitializing) {
      // Only check after auth state is resolved
      if (!isAuthenticated) {
        router.push('/auth/signin?redirectUrl=/roles'); // Redirect to signin if not authenticated
      } else if (user && ALLOWED_ROLES.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        // Optionally redirect to an unauthorized page or show an inline message
        // For now, we'll handle rendering based on isAuthorized state
        showSnackbar('You are not authorized to view this page.', 'error');
        router.push('/'); // Redirect to a safe page like home/dashboard
      }
    }
  }, [authIsInitializing, isAuthenticated, user, router, showSnackbar]);

  const fetchRolesAndPermissions = useCallback(async () => {
    if (!isAuthorized) return; // Don't fetch if not authorized

    setIsLoading(true);
    setError(null);
    try {
      // This Promise.all still works perfectly
      const [rolesData, permissionsPaginatedData] = await Promise.all([
        getAllRoles(page, rowsPerPage),
        getAllPermissionsSearch(), // Fetches the first page of permissions (up to 100 by default now)
      ]);

      console.log('API Response for Permissions:', permissionsPaginatedData); // This will now show the object with 'content'

      if (rolesData) {
        setRoles(rolesData.content);
        setTotalElements(rolesData.totalElements);
      }

      if (permissionsPaginatedData && permissionsPaginatedData) {
        setAllAvailablePermissions(permissionsPaginatedData);
      } else {
        setAllAvailablePermissions([]); // Fallback to empty array if data is malformed
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to load data.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, showSnackbar, isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      // Fetch data only if authorized
      fetchRolesAndPermissions();
    }
  }, [fetchRolesAndPermissions, isAuthorized]);

  const handleOpenModal = (role?: Role) => {
    setEditingRole(role || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = async () => {
    handleCloseModal();
    if (isAuthorized) fetchRolesAndPermissions();
  };

  const handleDeleteRole = async (roleId: number) => {
    console.log(roleId);
    if (isAuthorized) fetchRolesAndPermissions();
  };

  // While auth is initializing or authorization is being checked
  if (authIsInitializing || (isAuthenticated && !isAuthorized && !error)) {
    // Show loader until authorization is confirmed or denied
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authorized (and not initializing)
  if (!isAuthorized) {
    // The useEffect will redirect, but you can show a message here too
    // Or this component might not even render if redirect happens quickly
    return (
      <Container maxWidth='sm' sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant='h5'>Access Denied</Typography>
        <Typography>You do not have permission to view this page.</Typography>
        <Button component={Link} href='/' sx={{ mt: 2 }}>
          Go to Homepage
        </Button>
      </Container>
    );
  }

  // --- Authorized Content ---
  if (isLoading && roles.length === 0 && allAvailablePermissions.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant='h4' component='h1' sx={{ fontWeight: 'bold' }}>
            Role Management
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            disabled={isLoading || allAvailablePermissions.length === 0}
          >
            Add New Role
          </Button>
        </Box>

        {error && !isLoading && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading && roles.length > 0 && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!isLoading && roles.length === 0 && !error && (
          <Typography
            sx={{ textAlign: 'center', py: 5 }}
          >{`No roles found. Click "Add New Role" to get started.`}</Typography>
        )}

        {roles.length > 0 && (
          <RoleTable
            roles={roles}
            onEdit={handleOpenModal}
            onDeleteSuccess={handleDeleteRole}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(0);
            }}
          />
        )}

        {true && allAvailablePermissions.length > 0 && (
          <RoleFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveRole}
            role={editingRole}
            availablePermissions={allAvailablePermissions}
          />
        )}
        {isModalOpen &&
          allAvailablePermissions.length === 0 &&
          !isLoading && ( // only show if not loading permissions
            <Alert severity='warning' sx={{ mt: 2 }}>
              Permissions list could not be loaded. Cannot add or edit roles
              effectively.
            </Alert>
          )}
      </Paper>
    </Container>
  );
}
