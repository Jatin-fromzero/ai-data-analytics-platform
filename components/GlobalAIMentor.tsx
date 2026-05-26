'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIMentorChat } from './landing/AIMentorChat';

export function GlobalAIMentor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AIMentorChat 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />

      {/* Floating Orb Trigger */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center justify-center h-14 w-14 rounded-full bg-surface shadow-2xl border border-brand/30 focus:outline-none"
              aria-label="Open AI Mentor"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-brand/20 blur-md group-hover:bg-brand/40 transition-colors" />
              
              {/* Inner Circle */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>

              {/* Status Dot */}
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-surface shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />

              {/* Hover Tooltip */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-surface border border-border/50 backdrop-blur-md text-xs font-medium text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 shadow-xl">
                Chat with AI Mentor
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-[6px] border-l-surface" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
