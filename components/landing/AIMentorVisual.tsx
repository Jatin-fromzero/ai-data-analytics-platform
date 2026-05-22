'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIMentorVisualProps {
  onOpenChat: (initialMessage?: string) => void;
}

const floatingQuestions = [
  "How can I help you?",
  "Can I suggest a better path?",
  "Curious about career outcomes?",
  "Need help picking a course?"
];

/**
 * Enhanced AIMentorVisual — Premium CSS+SVG glowing core with floating question bubbles.
 * Clickable to open the AI Chat.
 */
export function AIMentorVisual({ onOpenChat }: AIMentorVisualProps) {
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Cycle through questions every 4 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuestion((prev) => (prev + 1) % floatingQuestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[400px]">
      {/* ── Interactive Wrapper ────────────────────────────────────────── */}
      <motion.button 
        onClick={() => onOpenChat()}
        className="relative w-full max-w-[420px] aspect-square mx-auto select-none group cursor-pointer focus:outline-none"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label="Open AI Mentor Chat"
      >
        {/* ── Subtle background crosshatch grid ─────────────────────────── */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.05] pointer-events-none transition-opacity group-hover:opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        {/* ── Floating Question Bubbles ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
          >
            <div 
              className="relative rounded-2xl border border-brand/30 bg-surface/90 px-4 py-2.5 shadow-[0_0_20px_rgba(255,107,53,0.15)] backdrop-blur-md transition-colors hover:border-brand/60"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger
                onOpenChat(floatingQuestions[activeQuestion]);
              }}
            >
              <p className="text-xs font-medium text-slate-200">
                <span className="text-brand mr-1.5">✦</span> 
                {floatingQuestions[activeQuestion]}
              </p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-brand/30" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Ambient glow — deep center radial ─────────────────────────── */}
        <div
          className="absolute inset-[10%] rounded-full pointer-events-none transition-all duration-500 group-hover:inset-[5%] group-hover:opacity-80"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.05) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* ── Outer orbital ring ─────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-[4%] rounded-full border border-slate-600/20 pointer-events-none group-hover:border-brand/20 transition-colors duration-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        >
          {/* Orbital dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-brand/50 shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-slate-400/50" />
        </motion.div>

        {/* ── Mid orbital ring ──────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-[18%] rounded-full border border-slate-500/15 pointer-events-none group-hover:border-slate-500/30 transition-colors duration-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {/* Orbital dot */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-brand/30 shadow-[0_0_12px_rgba(255,107,53,0.4)]" />
        </motion.div>

        {/* ── Inner ring / Core Boundary ────────────────────────────────── */}
        <motion.div
          className="absolute inset-[32%] rounded-full border border-brand/20 pointer-events-none group-hover:border-brand/40 transition-colors duration-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* ── Central AI Core ─────────────────────────────────────── */}
        <div className="absolute inset-[35%] flex items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Core inner pulse */}
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-brand/40 to-slate-900 mix-blend-screen"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: 'blur(8px)' }}
            />

            {/* Geometric Core SVG */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xl z-10"
            >
              <motion.path 
                d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" 
                stroke="rgba(255, 107, 53, 0.8)" 
                strokeWidth="1.5"
                fill="rgba(15, 23, 42, 0.8)"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "50% 50%" }}
              />
              <motion.path 
                d="M50 25 L70 37 L70 63 L50 75 L30 63 L30 37 Z" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth="1"
                fill="rgba(255, 107, 53, 0.1)"
                animate={{ rotate: [360, 270, 180, 90, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "50% 50%" }}
              />
              {/* Center Eye / Processor */}
              <circle cx="50" cy="50" r="8" fill="#FF6B35" />
              <circle cx="50" cy="50" r="4" fill="#FFF" />
            </svg>
          </div>
        </div>

        {/* ── Status badge — bottom ─────────────────────────────────────── */}
        <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          <div className="flex items-center gap-2 rounded-full border border-brand/30 bg-surface/90 px-3 py-1.5 backdrop-blur-sm group-hover:border-brand/60 transition-colors">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-brand"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[10px] font-semibold tracking-wider text-foreground uppercase flex items-center gap-1.5">
              Chat with AI Mentor
              <svg className="w-3 h-3 text-brand transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

      </motion.button>
    </div>
  );
}
