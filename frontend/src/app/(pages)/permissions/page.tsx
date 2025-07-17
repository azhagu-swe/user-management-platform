// src/app/(app)/admin/permissions/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { useTheme } from '@mui/material/styles';

import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/features/permission-management/types/permissionTypes';
import { getAllPermissions } from '@/features/permission-management/services/permissionService';
import PermissionTable from '@/features/permission-management/components/PermissionTable';
import PermissionFormModal from '@/features/permission-management/components/PermissionFormModal';
import { useSnackbar } from '@/hooks/useSnackbar';

// Define which roles are allowed to access this page
const ALLOWED_ROLES = ['SuperAdmin', 'AccountAdmin']; // Adjust as per your application's roles

export default function PermissionManagementPage() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { user, isAuthenticated, isInitializing: authIsInitializing } = useAuth();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For data fetching state
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // For page access authorization

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

   // --- Add state for pagination ---
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [totalElements, setTotalElements] = useState(0);


  // Authorization check effect
  useEffect(() => {
    if (!authIsInitializing) {
      if (!isAuthenticated) {
        router.push('/auth/signin?redirectUrl=/admin/permissions'); // Adjust redirectUrl
      } else if (user && ALLOWED_ROLES.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        showSnackbar('You are not authorized to view this page.', 'error');
        router.push('/'); // Redirect to a safe page (e.g., home or dashboard)
      }
    }
  }, [authIsInitializing, isAuthenticated, user, router, showSnackbar]);

 const fetchPermissions = useCallback(async () => {
    if (!isAuthorized) return;
    setIsLoading(true);
    setError(null);
    try {
      // Pass pagination state to the service call
      const permissionsData = await getAllPermissions(page, rowsPerPage);
      if (permissionsData) {
        setPermissions(permissionsData.content); // <-- Use the 'content' array
        setTotalElements(permissionsData.totalElements); // <-- Set total elements for pagination
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to load permissions.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized, showSnackbar, page, rowsPerPage]);
  useEffect(() => {
    if (isAuthorized) { // Fetch data only if authorized
      fetchPermissions();
    }
  }, [fetchPermissions, isAuthorized]);

  const handleOpenModal = (permission?: Permission) => {
    setEditingPermission(permission || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
  };

  const handleSavePermission = () => {
    handleCloseModal();
    if (isAuthorized) { // Re-fetch permissions after save
      fetchPermissions();
    }
  };

  const handleDeletePermission = () => {
    if (isAuthorized) { // Re-fetch permissions after delete
      fetchPermissions();
    }
  };

  // Render loading state while auth is initializing or authorization is pending
  if (authIsInitializing || (isAuthenticated && !isAuthorized && !error)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' /* Adjust based on your layout's header/sidebar height */ }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading session...</Typography>
      </Box>
    );
  }

  // Render access denied message if not authorized (and auth check is complete)
  if (!isAuthorized) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 5, mt: 5 }}>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[3] }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            You do not have the required permissions to view this page.
          </Typography>
          <Button component={Link} href="/" sx={{ mt: 3 }} variant="outlined">
            Go to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  // Render loading state for initial data fetch if authorized
  if (isLoading && permissions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading permissions...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Permission Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            disabled={isLoading} // Disable if currently loading permissions
          >
            Add New Permission
          </Button>
        </Box>

        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table loading indicator (if loading but already have some data) */}
        {isLoading && permissions.length > 0 && (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
                <CircularProgress size={30} />
            </Box>
        )}

        {!isLoading && permissions.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                No Permissions Configured
            </Typography>
            <Typography variant="body2" color="text.disabled">
                {`Click "Add New Permission" to define system permissions.`}
            </Typography>
          </Box>
        )}

        {permissions.length > 0 && (
          <PermissionTable
          permissions={permissions}
          isLoading={isLoading} // Pass loading state to table
          onEdit={handleOpenModal}
          onDeleteSuccess={handleDeletePermission}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0); // Go back to the first page when changing page size
          }}
        />
        )}

        {isModalOpen && ( // Conditionally render modal
          <PermissionFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSavePermission}
            permission={editingPermission}
          />
        )}
      </Paper>
    </Container>
  );
}
