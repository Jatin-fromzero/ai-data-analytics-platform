'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { PageReveal, FadeUp, HoverCard, ScrollReveal } from '@/components/ui/motion';
import { apiClient } from '@/frontend/lib/api-client';
import { AlertCircle, CheckCircle, Gift, Loader2, Lock, Sparkles, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Multi-Course Coupon states
  const [couponCodes, setCouponCodes] = useState<Record<string, string>>({});
  const [couponLoadingId, setCouponLoadingId] = useState<string | null>(null);
  const [couponMessages, setCouponMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({});

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>('/api/dashboard');
      if (res.success && res.data) {
        setCourses(res.data.courses || []);
        setActiveCourse(res.data.activeCourse || null);
      } else {
        setError(res.error || 'Failed to retrieve your student profile.');
      }
    } catch (err) {
      setError('Connection to security server timed out. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    const code = couponCodes[courseId]?.trim();
    if (!code) return;

    try {
      setCouponLoadingId(courseId);
      // Clear previous message for this course
      setCouponMessages(prev => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });

      const res = await apiClient.post<any>('/api/courses/enroll', {
        courseId,
        couponCode: code.toUpperCase(),
      });

      if (res.success) {
        setCouponMessages(prev => ({
          ...prev,
          [courseId]: { type: 'success', text: 'Course unlocked successfully! Access configured.' }
        }));
        setCouponCodes(prev => ({ ...prev, [courseId]: '' }));
        // Reload dashboard to update unlock states dynamically
        await loadDashboard();
      } else {
        setCouponMessages(prev => ({
          ...prev,
          [courseId]: { type: 'error', text: res.error || 'Invalid or expired coupon code.' }
        }));
      }
    } catch (err) {
      setCouponMessages(prev => ({
        ...prev,
        [courseId]: { type: 'error', text: 'Error applying coupon. Please check rate limiting.' }
      }));
    } finally {
      setCouponLoadingId(null);
    }
  };

  // Apple-grade dynamic spring transitions
  const springTransition = { type: 'spring', stiffness: 100, damping: 15 };

  // 1. LOADING STATE - Cinematic Glass Skeleton
  if (loading) {
    return (
      <div className="space-y-10 pb-16 animate-pulse">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-800/60 rounded" />
            <div className="h-8 w-64 bg-slate-800/60 rounded" />
            <div className="h-4 w-80 bg-slate-800/60 rounded" />
          </div>
        </header>
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-56 bg-slate-900/40 border border-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // 2. ERROR STATE - Beautiful alert container
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-semibold text-white mb-2">Sync Error</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">{error}</p>
        <Button onClick={loadDashboard} className="bg-brand text-background hover:bg-brand/90 px-6 h-10 rounded-xl font-semibold">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <PageReveal>
      <div className="space-y-12 pb-16">
        
        {/* ── WELCOME & CONTEXT (Linear-style Header) ──────────────────── */}
        <FadeUp>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand">AI Tech Educare OS</p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Analyst'}.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Unlocking multi-disciplinary AI technical learning milestones in real-time.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button asChild variant="secondary" size="sm" className="h-10 border border-white/50 bg-white/[0.02] hover:bg-white/[0.05] font-medium transition-all rounded-xl">
                <Link href="/dashboard/syllabus">View Milestone Roadmap</Link>
              </Button>
            </div>
          </header>
        </FadeUp>

        {/* ── COURSE DIRECTORY (Locked/Unlocked Grid) ────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">AI Technical Course Catalog</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure your learning track by redeeming coupons for locked modules. Active modules compile progress logs in real-time.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 gap-6">
              {courses.map((course) => {
                const isUnlocked = course.isUnlocked;
                const progress = course.progressPercent || 0;
                
                // Segments for progress bar
                const segments = [1, 2, 3, 4, 5];
                const filledSegments = Math.floor((progress / 100) * segments.length);
                const fractionalSegment = ((progress / 100) * segments.length) % 1;

                return (
                  <FadeUp key={course.id}>
                    <Card className={`relative overflow-hidden border transition-all duration-300 p-6 sm:p-8 rounded-2xl ${
                      isUnlocked 
                        ? 'border-brand/20 bg-white/[0.01] hover:border-brand/40 shadow-xl' 
                        : 'border-white/[0.02] bg-slate-950/20 opacity-85 hover:opacity-100'
                    }`}>
                      {/* Brand dynamic neon glow accents */}
                      {isUnlocked && (
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                        <div className="space-y-4 flex-1">
                          {/* Course Status Badge */}
                          <div className="flex items-center gap-2">
                            {isUnlocked ? (
                              <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold py-0.5 px-2.5 rounded-full capitalize">
                                Active Workspace
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-900 border border-white/5 text-slate-400 text-[10px] font-bold py-0.5 px-2.5 rounded-full capitalize flex items-center gap-1.5">
                                <Lock className="h-3 w-3 shrink-0 text-slate-500" /> Locked Module
                              </Badge>
                            )}
                            <span className="text-[10px] text-slate-600 font-mono">ID: {course.slug}</span>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{course.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">{course.description}</p>
                          </div>

                          {/* Progress section for active courses */}
                          {isUnlocked && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                                  {course.completedLessons}/{course.totalLessons} Lessons Complete
                                </span>
                                <span className="font-bold">{progress}% Completed</span>
                              </div>

                              {/* Segmented Progress Tracker */}
                              <div className="flex gap-1.5 h-2.5 w-full">
                                {segments.map((_, idx) => (
                                  <div key={idx} className="flex-1 rounded-full bg-slate-900 overflow-hidden relative border border-white/[0.01]">
                                    {idx < filledSegments && (
                                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5, delay: idx * 0.05 }} className="h-full bg-brand" />
                                    )}
                                    {idx === filledSegments && fractionalSegment > 0 && (
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${fractionalSegment * 100}%` }} transition={{ duration: 0.5 }} className="h-full bg-brand relative" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Lock unlock card input */}
                          {!isUnlocked && (
                            <div className="pt-2">
                              <form onSubmit={(e) => handleApplyCoupon(e, course.id)} className="space-y-3 max-w-md">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={couponCodes[course.id] || ''}
                                    onChange={(e) => setCouponCodes(prev => ({ ...prev, [course.id]: e.target.value }))}
                                    placeholder="ENTER COUPON CODE"
                                    className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-xs text-white placeholder:text-slate-600 uppercase tracking-widest focus:border-brand focus:outline-none transition-all"
                                  />
                                  <Button 
                                    type="submit" 
                                    disabled={couponLoadingId === course.id} 
                                    className="bg-brand text-background hover:bg-brand/90 font-semibold px-4 h-9 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                                  >
                                    {couponLoadingId === course.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Unlock'}
                                  </Button>
                                </div>
                                {couponMessages[course.id] && (
                                  <p className={`text-[10px] font-medium flex items-center gap-1.5 ${
                                    couponMessages[course.id].type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                                  }`}>
                                    {couponMessages[course.id].type === 'success' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                    {couponMessages[course.id].text}
                                  </p>
                                )}
                              </form>
                            </div>
                          )}
                        </div>

                        {/* Right side launch buttons */}
                        {isUnlocked && (
                          <div className="shrink-0 flex items-center sm:self-center">
                            {course.resumeUrl ? (
                              <Button asChild className="shadow-[0_0_20px_rgba(255,107,53,0.15)] bg-brand text-background hover:bg-brand/90 font-bold px-6 h-11 rounded-xl text-xs transition-all flex items-center gap-1">
                                <Link href={course.resumeUrl}>
                                  Enter Workspace <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            ) : (
                              <Button size="sm" disabled className="bg-slate-800 text-slate-500 h-10 rounded-xl px-5 text-xs">
                                Course Completed
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>
          </div>

          {/* ── SIDEBAR SYSTEM (Checklist & AI Mentor Widgets) ────────────────────────── */}
          <div className="space-y-6 lg:mt-[104px]">
            
            {/* Global AI Mentor Integration Widget */}
            <FadeUp delay={0.2}>
              <Card className="p-6 border border-white/[0.03] bg-gradient-to-b from-brand/5 to-transparent relative overflow-hidden group rounded-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand mb-6">Educare AI Copilot</h3>
                
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-11 w-11 rounded-full bg-slate-800/80 border border-brand/20 flex items-center justify-center text-xl shadow-inner">
                      🤖
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#07070E] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">Welcome to AI Educare OS.</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">I am your socratic mentor. Redeem coupon codes to unlock digital marketing, SQL database paths, web dev, or graphic design tracks!</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.04]">
                  <Button asChild variant="ghost" className="w-full text-xs font-semibold border border-brand/20 text-brand hover:bg-brand/10 hover:text-brand transition-colors h-9 rounded-xl">
                    <Link href="/learning">Initialize Chat</Link>
                  </Button>
                </div>
              </Card>
            </FadeUp>

            {/* Career Readiness Checklist */}
            {activeCourse?.careerChecklist && (
              <FadeUp delay={0.3}>
                <Card className="p-6 border border-white/[0.03] bg-white/[0.01] rounded-2xl">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Career Placement Milestones</h3>
                  <ul className="space-y-4">
                    {activeCourse.careerChecklist.map((item: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                          item.done ? 'bg-brand border-brand' : 'border-white/10 bg-slate-950/40 group-hover:border-brand/40'
                        }`}>
                          {item.done && <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs font-medium transition-colors ${
                          item.done ? 'text-slate-500 line-through decoration-slate-500/50' : 'text-slate-300'
                        }`}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeUp>
            )}
            
          </div>

        </div>
      </div>
    </PageReveal>
  );
}
