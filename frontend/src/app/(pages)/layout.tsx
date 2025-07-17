import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout'; // Adjust path if needed

// This layout applies MainLayout to all routes within the (app) group
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
