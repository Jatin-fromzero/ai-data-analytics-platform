'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageReveal, FadeUp } from '@/components/ui/motion';
import { apiClient } from '@/frontend/lib/api-client';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  GraduationCap,
  MessageSquare,
  Send,
  X,
  Play,
  Volume2,
  Maximize,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function CourseConsolePage() {
  const params = useParams();
  const router = useRouter();

  const courseSlug = params?.courseSlug as string;
  const partSlug = params?.part as string;

  const [partData, setPartData] = useState<any>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [completeLoading, setCompleteLoading] = useState(false);

  // Socratic AI Mentor Sidebar States
  const [showMentor, setShowMentor] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: "Hello! I am your Socratic AI Mentor. Ask me any conceptual questions, debug database schemas, or request explanations for the current lesson materials!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Video Simulator Player States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25); // Simulated active timestamp percentage

  const loadLessonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>(
        `/api/courses/lesson?courseSlug=${courseSlug}&partSlug=${partSlug}`
      );
      if (res.success && res.data) {
        setPartData(res.data);
      } else {
        setError(res.error || 'Failed to retrieve lesson records from server.');
      }
    } catch (err) {
      setError('Connection to course content server timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, partSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle active lesson swaps - resets chat intro and video play states
  useEffect(() => {
    if (partData?.lessons) {
      const active = partData.lessons[activeLessonIdx];
      setMessages([
        {
          role: 'assistant',
          content: `Greetings! I am your AI Socratic Mentor. Ask me any questions about our active milestone: **"${active?.title || 'Current Topic'}"** and let's explore together!`
        }
      ]);
      setIsVideoPlaying(false);
      setVideoProgress(20);
    }
  }, [activeLessonIdx, partData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070E] flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="space-y-4 text-center max-w-sm">
          <Loader2 className="h-10 w-10 text-brand animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 tracking-widest uppercase animate-pulse">
            Loading Educational Assets...
          </p>
        </div>
      </div>
    );
  }

  if (error || !partData || !partData.lessons || partData.lessons.length === 0) {
    return (
      <div className="min-h-screen bg-[#07070E] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-white mb-2">Workspace Load Failure</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          {error || 'The requested lesson or module outlines could not be retrieved.'}
        </p>
        <Button asChild className="bg-brand text-background hover:bg-brand/90 px-6 rounded-xl font-bold text-xs h-10">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const lessons = partData.lessons;
  const activeLesson = lessons[activeLessonIdx];

  const handleCompleteLesson = async () => {
    try {
      setCompleteLoading(true);
      const res = await apiClient.post<any>('/api/courses/lesson/complete', {
        lessonId: activeLesson.id,
        timeSpent: 30, // Default estimated interaction slot
      });

      if (res.success) {
        // Optimistically update UI status
        const updatedLessons = [...lessons];
        updatedLessons[activeLessonIdx].completed = true;
        setPartData({ ...partData, lessons: updatedLessons });

        // Advance to next lesson or route back if finished
        if (activeLessonIdx < lessons.length - 1) {
          setActiveLessonIdx(activeLessonIdx + 1);
        } else {
          // All lessons in part completed! Route back
          router.push(`/courses/${courseSlug}`);
        }
      }
    } catch (err) {
      console.error('Failed to update progress log:', err);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputMessage.trim();
    if (!cleanInput || chatLoading) return;

    const newMessages = [...messages, { role: 'user', content: cleanInput }];
    setMessages(newMessages);
    setInputMessage('');
    setChatLoading(true);

    try {
      const res = (await apiClient.post<any>('/api/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        courseSlug,
        partSlug
      })) as any;

      if (res && res.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Connection with Socratic Engine interrupted. Please resend.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Gemini rate limits active. Please try again shortly.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="h-4 w-4 shrink-0" />;
      case 'TEXT': return <FileText className="h-4 w-4 shrink-0" />;
      default: return <HelpCircle className="h-4 w-4 shrink-0" />;
    }
  };

  return (
    <PageReveal>
      <div className="flex min-h-screen bg-[#07070E] text-slate-200 font-sans overflow-hidden">
        
        {/* ── LEFT LESSON CONSOLE NAVIGATION (Apple Slate style) ─────────────────── */}
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/[0.04] bg-[#0A0A0F]/90 backdrop-blur-2xl p-6 fixed h-screen z-30 justify-between">
          <div className="space-y-6 overflow-y-auto scrollbar-hide flex-1">
            <Link href={`/courses/${courseSlug}`} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group mb-4">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Course Workspace
            </Link>

            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Module Outline</p>
              <h2 className="text-base font-extrabold text-white tracking-tight truncate">{partData.partTitle}</h2>
              <p className="text-[10px] text-brand/80 font-medium">{partData.phaseTitle}</p>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-white/[0.04]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-1 mb-2">Milestone Checklist</p>
              {lessons.map((lesson: any, idx: number) => {
                const isActive = idx === activeLessonIdx;
                const isCompleted = lesson.completed;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIdx(idx)}
                    className={`w-full flex items-center justify-between text-left gap-3 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 group ${
                      isActive 
                        ? 'bg-brand/10 border-brand/20 text-brand' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getLessonIcon(lesson.type)}
                      <span className="truncate pr-2">{lesson.title}</span>
                    </div>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-4 text-center">
            <span className="text-[10px] text-slate-600 font-mono tracking-wider">AI Tech Educare OS console</span>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA & SIDEBAR SPLIT ─────────────────────────────────────────── */}
        <div className="flex-1 lg:pl-72 flex flex-row min-h-screen relative">
          
          {/* Main workspace scrollable area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            
            {/* Breadcrumb Header */}
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.03] bg-[#07070E]/85 px-6 sm:px-8 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <GraduationCap className="h-4 w-4 text-brand shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-slate-400 truncate">
                  {partData.courseTitle}
                </span>
                <span className="text-xs text-slate-600 shrink-0">/</span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-200 truncate">
                  Lesson {activeLesson.order}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* AI Mentor Chat Sidebar Toggle Button */}
                <Button 
                  onClick={() => setShowMentor(!showMentor)}
                  variant="ghost" 
                  className={`h-9 px-4 text-xs font-bold border rounded-xl flex items-center gap-1.5 transition-all ${
                    showMentor 
                      ? 'border-brand/40 bg-brand/10 text-brand' 
                      : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" /> AI Mentor
                </Button>

                <Button asChild variant="ghost" className="h-9 px-4 text-xs font-semibold border border-white/5 hover:bg-white/5 rounded-xl">
                  <Link href={`/courses/${courseSlug}`}>Exit Workspace</Link>
                </Button>
              </div>
            </header>

            {/* Lesson Content Canvas */}
            <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-14 max-w-4xl mx-auto w-full relative">
              <FadeUp key={activeLesson.id} delay={0.05}>
                <div className="space-y-8">
                  
                  {/* Lesson Header */}
                  <div className="space-y-4 border-b border-white/[0.04] pb-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-brand/10 border border-brand/20 text-brand text-[9px] font-bold py-0.5 px-2.5 rounded-full capitalize">
                        {activeLesson.type.toLowerCase()} milestone
                      </Badge>
                      {activeLesson.completed && (
                        <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold py-0.5 px-2.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-snug">
                      {activeLesson.title}
                    </h1>
                  </div>

                  {/* Dynamic Video Player Viewport (Glow style) */}
                  {activeLesson.type === 'VIDEO' && (
                    <div className="relative rounded-[2rem] border border-white/[0.05] bg-slate-950/40 backdrop-blur-2xl overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.9)] group/player aspect-video">
                      {/* Video Poster glow gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5 z-0" />
                      
                      {/* Active Player Interface */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {isVideoPlaying ? (
                          // Playing indicator / custom wave
                          <div className="space-y-2 text-center" onClick={() => setIsVideoPlaying(false)}>
                            <div className="flex items-center justify-center gap-1.5 h-8">
                              <span className="w-1 h-6 rounded bg-brand animate-[bounce_1s_infinite_0ms]" />
                              <span className="w-1 h-8 rounded bg-brand animate-[bounce_1s_infinite_150ms]" />
                              <span className="w-1 h-5 rounded bg-brand animate-[bounce_1s_infinite_300ms]" />
                              <span className="w-1 h-7 rounded bg-brand animate-[bounce_1s_infinite_450ms]" />
                            </div>
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">Milestone Video Streaming</span>
                          </div>
                        ) : (
                          // Big premium glowing Play button
                          <motion.button 
                            whileHover={{ scale: 1.06 }}
                            onClick={() => setIsVideoPlaying(true)}
                            className="h-16 w-16 rounded-full bg-brand text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(255,107,53,0.35)] transition-all hover:bg-brand/90 pl-1"
                          >
                            <Play className="h-6 w-6 fill-slate-950" />
                          </motion.button>
                        )}
                      </div>

                      {/* Video Controller control bar (Apple console style) */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 to-transparent z-10 flex items-center justify-between gap-4 border-t border-white/[0.04]">
                        <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="text-white hover:text-brand transition-colors">
                          <Play className={`h-4 w-4 ${isVideoPlaying ? 'fill-white' : ''}`} />
                        </button>
                        
                        {/* Progress Bar Timeline */}
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative cursor-pointer" onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          setVideoProgress(Math.floor((clickX / rect.width) * 100));
                        }}>
                          <div className="absolute top-0 bottom-0 left-0 bg-brand rounded-full" style={{ width: `${videoProgress}%` }} />
                        </div>

                        <span className="text-[9px] font-mono text-slate-400">03:45 / 12:10</span>
                        
                        <div className="flex items-center gap-2 text-slate-400">
                          <Volume2 className="h-4 w-4 hover:text-white cursor-pointer" />
                          <Settings className="h-4 w-4 hover:text-white cursor-pointer" />
                          <Maximize className="h-4 w-4 hover:text-white cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rich Markdown Core Body */}
                  <div className="min-h-[35vh] pb-10">
                    <MarkdownRenderer content={activeLesson.content || '*Dynamic educational contents are currently deploying...*'} />
                  </div>

                  {/* Next Step Controls (Apple glass-bottom bar style) */}
                  <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <Button 
                        disabled={activeLessonIdx === 0} 
                        onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                        variant="secondary"
                        className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] h-10 rounded-xl px-4 flex items-center gap-1.5 text-xs text-slate-300 disabled:opacity-30"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>
                      <Button 
                        disabled={activeLessonIdx === lessons.length - 1} 
                        onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                        variant="secondary"
                        className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] h-10 rounded-xl px-4 flex items-center gap-1.5 text-xs text-slate-300 disabled:opacity-30"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      onClick={handleCompleteLesson}
                      disabled={completeLoading}
                      className="shadow-[0_0_20px_rgba(255,107,53,0.15)] bg-brand text-background hover:bg-brand/90 font-bold px-6 h-10 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      {completeLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                      {activeLessonIdx === lessons.length - 1 ? 'Complete Part & Exit Workspace →' : 'Complete & Next Lesson →'}
                    </Button>
                  </div>

                </div>
              </FadeUp>
            </main>
          </div>

          {/* ── TOGGLEABLE SOCRATIC AI MENTOR SIDEBAR (Framer Motion Slide) ── */}
          <AnimatePresence>
            {showMentor && (
              <motion.aside 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="shrink-0 border-l border-white/[0.04] bg-[#0A0A0F]/95 backdrop-blur-2xl flex flex-col h-screen relative z-10 select-none overflow-hidden"
              >
                {/* Sidebar Header */}
                <div className="p-5 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-brand/20 to-transparent border border-brand/20 flex items-center justify-center text-sm">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest leading-none">AI Socratic Mentor</h3>
                      <p className="text-[8px] text-slate-500 font-semibold tracking-wider mt-0.5">Context: Lesson {activeLesson.order}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowMentor(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Messages Log */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide text-xs">
                  {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed border ${
                          isUser 
                            ? 'bg-brand/10 border-brand/20 text-slate-200 rounded-tr-none' 
                            : 'bg-white/[0.02] border-white/[0.04] text-slate-300 rounded-tl-none'
                        }`}>
                          <div className="space-y-1.5">
                            {msg.content.split('\n\n').map((para: string, idx: number) => (
                              <p key={idx} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input box */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/[0.04] bg-white/[0.01]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask AI Mentor..."
                      disabled={chatLoading}
                      className="flex-1 bg-slate-950/40 border border-white/[0.05] rounded-full px-4 py-2 text-[11px] text-white placeholder:text-slate-600 focus:border-brand/40 focus:outline-none transition-all disabled:opacity-50"
                    />
                    <Button 
                      type="submit" 
                      disabled={chatLoading || !inputMessage.trim()}
                      className="bg-brand text-slate-950 hover:bg-brand/90 font-bold h-9 w-9 shrink-0 p-0 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.2)] transition-all disabled:opacity-50 hover:scale-105"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>

              </motion.aside>
            )}
          </AnimatePresence>

        </div>

      </div>
    </PageReveal>
  );
}
