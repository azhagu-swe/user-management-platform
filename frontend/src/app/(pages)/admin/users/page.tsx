// src/app/(app)/admin/users/page.tsx
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
import { User } from '@/features/user-management/types/userTypes';
import { Role } from '@/features/role-management/types/roleTypes'; // For role selector
import { getAllUsers } from '@/features/user-management/services/userService';
import { getAllRolesList } from '@/features/role-management/services/roleService'; // A non-paginated version for selectors
import UserTable from '@/features/user-management/components/UserTable';
import UserFormModal from '@/features/user-management/components/UserFormModal';
import { useSnackbar } from '@/hooks/useSnackbar';

const ALLOWED_ROLES = ['SuperAdmin']; // Example: Only SuperAdmin can manage users

export default function UserManagementPage() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { user, isAuthenticated, isInitializing: authIsInitializing } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [allAvailableRoles, setAllAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  // Authorization Check
  useEffect(() => {
    if (!authIsInitializing) {
      if (!isAuthenticated) {
        router.push('/auth/signin?redirectUrl=/admin/users');
      } else if (user && ALLOWED_ROLES.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        showSnackbar('You are not authorized to view this page.', 'error');
        router.push('/');
      }
    }
  }, [authIsInitializing, isAuthenticated, user, router, showSnackbar]);

  const fetchData = useCallback(async () => {
    if (!isAuthorized) return;

    setIsLoading(true);
    setError(null);
    try {
      // Fetch both users and the full list of roles for the form modal concurrently
      const [usersData, rolesData] = await Promise.all([
        getAllUsers(page, rowsPerPage),
        getAllRolesList(), // You'll need this service function
      ]);

      if (usersData) {
        setUsers(usersData.content);
        setTotalElements(usersData.totalElements);
      }
      setAllAvailableRoles(rolesData || []);

    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to load user management data.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized, page, rowsPerPage, showSnackbar]);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [fetchData, isAuthorized]);

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    handleCloseModal();
    if (isAuthorized) fetchData(); // Re-fetch users after save
  };

  const handleDeleteUser = () => {
    if (isAuthorized) fetchData(); // Re-fetch users after delete
  };

  // --- Render logic ---
  if (authIsInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 5, mt: 5 }}>
            <Paper sx={{p:3, borderRadius: 2}}><Typography variant="h5">Access Denied</Typography></Paper>
        </Container>
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
            User Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            disabled={isLoading || allAvailableRoles.length === 0}
          >
            Add New User
          </Button>
        </Box>

        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDeleteSuccess={handleDeleteUser}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />

        {isModalOpen && (
          <UserFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
            user={editingUser}
            availableRoles={allAvailableRoles}
          />
        )}
      </Paper>
    </Container>
  );
}