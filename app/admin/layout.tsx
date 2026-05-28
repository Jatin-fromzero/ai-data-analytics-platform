import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </ProtectedRoute>
  );
}
