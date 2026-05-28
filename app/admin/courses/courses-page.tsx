'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Search, Plus, MoreHorizontal, BookOpen, Clock, Lock, ChevronDown, ChevronRight, FileText, PlayCircle, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/frontend/lib/api-client';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Forms dynamic inline state
  const [addingPhaseCourseId, setAddingPhaseCourseId] = useState<string | null>(null);
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseOrder, setNewPhaseOrder] = useState(1);

  const [addingLessonPartId, setAddingLessonPartId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'TEXT' | 'QUIZ'>('VIDEO');
  const [newLessonOrder, setNewLessonOrder] = useState(1);

  // Modal create course
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSlug, setNewCourseSlug] = useState('');

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>(
        `/api/admin/courses?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`
      );
      if (res.success && res.data) {
        setCourses(res.data.courses);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setError(res.error || 'Failed to load course matrix.');
      }
    } catch (err) {
      setError('Connection to course repository failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [searchQuery, page]);

  const toggleExpand = (id: string) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  // Add course submit via REST
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseSlug.trim()) return;

    try {
      setModalLoading(true);
      setError(null);
      setSuccess(null);
      const res = await apiClient.post<any>('/api/admin/courses', {
        action: 'course',
        title: newCourseTitle.trim(),
        slug: newCourseSlug.trim().toLowerCase()
      });
      if (res.success) {
        setSuccess(`Course '${newCourseTitle}' created as a DRAFT!`);
        setModalOpen(false);
        setNewCourseTitle('');
        setNewCourseSlug('');
        loadCourses();
      } else {
        setError(res.error || 'Failed to create course.');
      }
    } catch (err) {
      setError('Validation error during course creations.');
    } finally {
      setModalLoading(false);
    }
  };

  // Add phase submit via REST
  const handleAddPhase = async (courseId: string) => {
    if (!newPhaseTitle.trim()) return;

    try {
      setError(null);
      setSuccess(null);
      const res = await apiClient.post<any>('/api/admin/courses', {
        action: 'phase',
        courseId,
        title: newPhaseTitle.trim(),
        order: Number(newPhaseOrder)
      });
      if (res.success) {
        setSuccess('Dynamic Phase successfully added to Curriculum!');
        setNewPhaseTitle('');
        setNewPhaseOrder(1);
        setAddingPhaseCourseId(null);
        loadCourses();
      } else {
        setError(res.error || 'Failed to add phase.');
      }
    } catch (err) {
      setError('Validation error adding phase.');
    }
  };

  // Add lesson submit via REST
  const handleAddLesson = async (partId: string) => {
    if (!newLessonTitle.trim()) return;

    try {
      setError(null);
      setSuccess(null);
      const res = await apiClient.post<any>('/api/admin/courses', {
        action: 'lesson',
        partId,
        title: newLessonTitle.trim(),
        type: newLessonType,
        order: Number(newLessonOrder)
      });
      if (res.success) {
        setSuccess('Dynamic Lesson successfully compiled and integrated!');
        setNewLessonTitle('');
        setNewLessonOrder(1);
        setAddingLessonPartId(null);
        loadCourses();
      } else {
        setError(res.error || 'Failed to compile lesson.');
      }
    } catch (err) {
      setError('Validation error inserting lesson.');
    }
  };

  return (
    <div className="space-y-8 relative">
      <PageHeader 
        title="Course Management" 
        description="Design your curriculum, manage phases and lessons, and control progression logic."
        actions={
          <button 
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </button>
        }
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
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-brand/50 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all bg-slate-900/40 px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center border border-white/5 bg-[#121214]/50 rounded-2xl">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-[#121214]/50 backdrop-blur-sm">
          <div className="flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:grid">
              <div className="col-span-5">Course Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Active Students</div>
              <div className="col-span-2">Last Updated</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {courses.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  No courses registered in catalog. Click &apos;Create Course&apos; above.
                </div>
              ) : (
                courses.map((course) => {
                  const isExpanded = expandedCourse === course.id;
                  
                  return (
                    <div key={course.id} className="flex flex-col transition-colors duration-200">
                      {/* Primary Row */}
                      <div 
                        onClick={() => toggleExpand(course.id)}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer hover:bg-white/[0.02]"
                      >
                        <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                            <BookOpen className="h-5 w-5 text-brand" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{course.title}</p>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {course.phases?.length || 0} Phases
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border",
                            course.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          )}>
                            {course.status}
                          </span>
                        </div>

                        <div className="col-span-1 md:col-span-2 text-slate-300 font-semibold text-sm">
                          {course.enrolled?.toLocaleString() || '0'}
                        </div>

                        <div className="col-span-1 md:col-span-2 text-xs text-slate-400">
                          {course.lastUpdated}
                        </div>

                        <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-2">
                          <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content (Hierarchical View) */}
                      {isExpanded && (
                        <div className="bg-[#0A0A0A]/50 border-t border-white/5 p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-semibold text-white">Curriculum Structure</h4>
                            
                            {addingPhaseCourseId !== course.id ? (
                              <button 
                                onClick={() => setAddingPhaseCourseId(course.id)}
                                className="text-xs font-semibold text-brand hover:text-brand/80"
                              >
                                + Add Phase
                              </button>
                            ) : (
                              <div className="flex gap-2 items-center bg-[#0C0C12] p-3 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-150">
                                <input
                                  type="text"
                                  placeholder="Phase Title"
                                  value={newPhaseTitle}
                                  onChange={(e) => setNewPhaseTitle(e.target.value)}
                                  className="rounded-lg bg-background px-3 py-1 text-xs text-white border border-white/10"
                                />
                                <input
                                  type="number"
                                  value={newPhaseOrder}
                                  onChange={(e) => setNewPhaseOrder(Number(e.target.value))}
                                  className="w-12 rounded-lg bg-background px-2 py-1 text-xs text-white border border-white/10 text-center"
                                />
                                <button onClick={() => handleAddPhase(course.id)} className="bg-brand text-background px-3 py-1 rounded-lg text-xs font-bold">Save</button>
                                <button onClick={() => setAddingPhaseCourseId(null)} className="text-xs text-slate-500 px-1">Cancel</button>
                              </div>
                            )}
                          </div>
                          
                          {(course.phases || []).length === 0 ? (
                            <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                              No phases created in syllabus tree yet. Click &apos;Add Phase&apos; above.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {(course.phases || []).map((phase: any) => (
                                <div key={phase.id} className="rounded-xl border border-white/10 bg-white/[0.01] overflow-hidden">
                                  <div className="bg-white/[0.02] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                    <h5 className="text-sm font-semibold text-slate-200">{phase.title}</h5>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Lock className="h-3 w-3 text-brand" />
                                      <span className="text-[9px] uppercase tracking-wider font-semibold text-brand">Sequenced Lock</span>
                                    </div>
                                  </div>

                                  <div className="divide-y divide-white/5">
                                    {(phase.parts || []).map((part: any) => (
                                      <div key={part.id} className="divide-y divide-white/5">
                                        <div className="bg-white/[0.01] px-4 py-1.5 text-xs text-brand font-medium tracking-tight">
                                          {part.title}
                                        </div>
                                        
                                        {(part.lessons || []).map((lesson: any, idx: number) => (
                                          <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/[0.01] transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                              <span className="text-xs font-semibold text-muted-foreground w-4">{idx + 1}.</span>
                                              {lesson.type === 'video' ? <PlayCircle className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4 text-amber-400" />}
                                              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                              <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                                            </div>
                                          </div>
                                        ))}

                                        <div className="px-6 py-2.5 bg-white/[0.01] flex items-center justify-between">
                                          {addingLessonPartId !== part.id ? (
                                            <button 
                                              onClick={() => setAddingLessonPartId(part.id)}
                                              className="text-xs text-muted-foreground hover:text-white transition-colors py-0.5"
                                            >
                                              + Add Lesson
                                            </button>
                                          ) : (
                                            <div className="flex gap-2 items-center bg-[#07070E] p-2.5 rounded-lg border border-white/5 w-full max-w-xl animate-in slide-in-from-top-2 duration-150">
                                              <input
                                                type="text"
                                                placeholder="Lesson Title"
                                                value={newLessonTitle}
                                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                                className="flex-1 rounded-lg bg-background px-3 py-1 text-xs text-white border border-white/10"
                                              />
                                              <select
                                                value={newLessonType}
                                                onChange={(e) => setNewLessonType(e.target.value as any)}
                                                className="rounded-lg bg-background px-2 py-1 text-xs text-white border border-white/10"
                                              >
                                                <option value="VIDEO">Video</option>
                                                <option value="TEXT">Text</option>
                                                <option value="QUIZ">Quiz</option>
                                              </select>
                                              <input
                                                type="number"
                                                value={newLessonOrder}
                                                onChange={(e) => setNewLessonOrder(Number(e.target.value))}
                                                className="w-12 rounded-lg bg-background px-2 py-1 text-xs text-white border border-white/10 text-center"
                                              />
                                              <button onClick={() => handleAddLesson(part.id)} className="bg-brand text-background px-3 py-1 rounded-lg text-xs font-bold">Add</button>
                                              <button onClick={() => setAddingLessonPartId(null)} className="text-xs text-slate-500 px-1">Cancel</button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-[#0E0E12] border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[40px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white">Create New Curriculum</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => {
                    setNewCourseTitle(e.target.value);
                    setNewCourseSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  placeholder="e.g. Modern Data Analytics Hub"
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={newCourseSlug}
                  onChange={(e) => setNewCourseSlug(e.target.value)}
                  placeholder="e.g. modern-data-analytics"
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
                  Create Course
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
