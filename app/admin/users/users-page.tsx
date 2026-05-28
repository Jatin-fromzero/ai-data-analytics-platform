'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, MoreHorizontal, Filter, Mail, Clock, BookOpen, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/frontend/lib/api-client';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Pagination and query state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'admins'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>(
        `/api/admin/users?q=${encodeURIComponent(searchQuery)}&role=${activeTab}&page=${page}&limit=${limit}`
      );
      if (res.success && res.data) {
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setError(res.error || 'Failed to load user accounts.');
      }
    } catch (err) {
      setError('Connection to user database failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchQuery, activeTab, page]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      const res = await apiClient.patch<any>('/api/admin/users', { targetUserId: userId, role: newRole });
      if (res.success) {
        setSuccess(`User role successfully changed to ${newRole}.`);
        loadUsers();
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      } else {
        setError(res.error || 'Failed to update user role.');
      }
    } catch (err) {
      setError('Error processing role alteration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      
      // Look up enrollments for this user via enrollments REST API
      const envRes = await apiClient.get<any>('/api/admin/enrollments');
      const userEnrollment = envRes.success && envRes.data.enrollments.find((e: any) => e.userId === userId);
      
      if (!userEnrollment) {
        setError('No active enrollments found for this user to revoke.');
        return;
      }

      const res = await apiClient.delete<any>(
        `/api/admin/enrollments?userId=${userId}&courseId=${userEnrollment.courseId}`
      );
      if (res.success) {
        setSuccess('Access successfully revoked and workspace dismantled.');
        setSelectedUser(null);
        loadUsers();
      } else {
        setError(res.error || 'Failed to revoke access.');
      }
    } catch (err) {
      setError('Error communicating with revoke action.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Student',
      render: (user: any) => (
        <div>
          <p className="font-medium text-slate-200">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      )
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (user: any) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wider border",
          user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
          user.role === 'STUDENT' ? 'bg-brand/10 text-brand border-brand/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        )}>
          {user.role}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs capitalize">Active</span>
        </span>
      )
    },
    { 
      key: 'enrollments', 
      header: 'Enrollments',
      render: (user: any) => (
        <span className="text-slate-300 font-medium">
          {user._count?.enrollments || 0}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 relative">
      <PageHeader 
        title="User Management" 
        description="Manage platform access, roles, and student enrollments."
      />
      
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-sm text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Toolbar & Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex bg-[#121214]/80 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
              {['all', 'students', 'admins'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setPage(1);
                  }}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all duration-200",
                    activeTab === tab 
                      ? 'bg-white/10 text-white shadow-sm' 
                      : 'text-muted-foreground hover:text-slate-300 hover:bg-white/5'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#121214]/50 pl-10 pr-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="w-full h-64 flex items-center justify-center border border-white/5 bg-[#121214]/50 rounded-2xl">
              <Loader2 className="h-8 w-8 text-brand animate-spin" />
            </div>
          ) : (
            <>
              <DataTable 
                data={users} 
                columns={columns} 
                onRowClick={(user) => setSelectedUser(user)}
              />
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 pt-4">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 text-slate-300 hover:bg-white/10"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 text-slate-300 hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Deep Details Sidebar Overlay */}
        {selectedUser && (
          <div className="w-full xl:w-80 shrink-0 bg-[#0A0A0A]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden animate-in slide-in-from-right-8 fade-in duration-300 backdrop-blur-xl">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand/10 blur-[40px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-lg font-medium text-white">Student Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xl border border-brand/30">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-md truncate max-w-[150px]">{selectedUser.name}</p>
                  <p className="text-xs text-brand capitalize font-medium">{selectedUser.role.toLowerCase()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300 truncate">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  {selectedUser.email}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleRoleChange(selectedUser.id, 'STUDENT')}
                    className={cn(
                      "py-2 text-xs font-semibold rounded-xl border border-white/5 hover:bg-white/5",
                      selectedUser.role === 'STUDENT' ? 'bg-brand/20 text-brand border-brand/30' : 'bg-transparent text-slate-400'
                    )}
                  >
                    Student
                  </button>
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleRoleChange(selectedUser.id, 'ADMIN')}
                    className={cn(
                      "py-2 text-xs font-semibold rounded-xl border border-white/5 hover:bg-white/5",
                      selectedUser.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-transparent text-slate-400'
                    )}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  disabled={actionLoading}
                  onClick={() => handleRevoke(selectedUser.id)}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Revoke Course Access
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
