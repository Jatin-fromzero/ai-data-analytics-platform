'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, MoreHorizontal, CheckCircle2, XCircle, Clock, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/frontend/lib/api-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Modal manual override state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  
  // Form input fields
  const [targetUserId, setTargetUserId] = useState('');
  const [targetCourseId, setTargetCourseId] = useState('');
  const [overrideReason, setOverrideReason] = useState('Manual Administrative Grant');

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>(
        `/api/admin/enrollments?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`
      );
      if (res.success && res.data) {
        setEnrollments(res.data.enrollments);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setError(res.error || 'Failed to load enrollment registry.');
      }
    } catch (err) {
      setError('Connection to enrollment database failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [searchQuery, page]);

  const handleOpenOverride = async () => {
    try {
      setModalOpen(true);
      // Fetch dynamic published courses catalog
      const res = await apiClient.get<any>('/api/admin/courses');
      if (res.success && res.data) {
        setCourses(res.data.courses);
        if (res.data.courses.length > 0) {
          setTargetCourseId(res.data.courses[0].id);
        }
      }
    } catch (err) {
      setError('Failed to fetch courses list for manual grant.');
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim() || !targetCourseId) return;

    try {
      setModalLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await apiClient.post<any>('/api/admin/enrollments', {
        action: 'manual',
        userId: targetUserId.trim(),
        courseId: targetCourseId,
        reason: overrideReason
      });

      if (res.success) {
        setSuccess('Manual access successfully configured and recorded in audit service!');
        setModalOpen(false);
        setTargetUserId('');
        setOverrideReason('Manual Administrative Grant');
        loadEnrollments();
      } else {
        setError(res.error || 'Enrollment manual override failed.');
      }
    } catch (err) {
      setError('An error occurred validating manual override schemas.');
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    { 
      key: 'studentName', 
      header: 'Student',
      render: (item: any) => (
        <div>
          <p className="font-medium text-slate-200">{item.studentName}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{item.studentEmail} (ID: {item.userId})</p>
        </div>
      )
    },
    { 
      key: 'course', 
      header: 'Course',
      render: (item: any) => (
        <span className="text-muted-foreground font-medium">{item.course}</span>
      )
    },
    { 
      key: 'accessType', 
      header: 'Access Type',
      render: (item: any) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
          item.accessType === 'coupon' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-white/5 border-white/10 text-slate-300'
        )}>
          {item.couponCode ? `Coupon: ${item.couponCode}` : item.accessType}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === 'active' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          {item.status === 'pending' && <Clock className="h-4 w-4 text-amber-400" />}
          {item.status === 'revoked' && <XCircle className="h-4 w-4 text-rose-400" />}
          <span className={cn(
            "text-sm capitalize font-medium",
            item.status === 'active' ? 'text-emerald-400' :
            item.status === 'pending' ? 'text-amber-400' : 'text-rose-400'
          )}>
            {item.status}
          </span>
        </div>
      )
    },
    { key: 'date', header: 'Date Enrolled' },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex justify-end">
          <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 relative">
      <PageHeader 
        title="Enrollments & Access" 
        description="Manage student access, approve manual enrollments, and track course unlocks."
        actions={
          <button 
            onClick={handleOpenOverride}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]"
          >
            <Plus className="h-4 w-4" />
            Manual Override
          </button>
        }
      />

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-sm text-rose-400 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-sm text-emerald-400 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student or course..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/10 bg-[#121214]/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center border border-white/5 bg-[#121214]/50 rounded-2xl">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      ) : (
        <>
          <DataTable data={enrollments} columns={columns} />
          
          {/* Pagination */}
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

      {/* Manual Override Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-[#0E0E12] border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[40px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white">Manual Enrollment Override</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleManualEnroll} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Student User ID (CUID)</label>
                <input
                  type="text"
                  required
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="e.g. clnshc6y20000..."
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Course</label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all appearance-none"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id} className="bg-[#0C0C12]">
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Override Reason</label>
                <input
                  type="text"
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Reason for manual grant..."
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  className="border border-white/5 hover:bg-white/5 h-10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={modalLoading}
                  className="bg-brand text-background hover:bg-brand/90 font-semibold px-6 h-10 rounded-xl flex items-center gap-2"
                >
                  {modalLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Grant Access
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
