'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingScreen — elegant short-lived entrance experience.
 * Shows for ~1.5s then smoothly fades out.
 * Automatically suppresses on repeated visits via sessionStorage.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const already = sessionStorage.getItem('ag_loaded');
    if (!already) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('ag_loaded', '1');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        >
          {/* Subtle background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Radial fade over the grid */}
          <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

          {/* Logo mark */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-bold text-foreground"
                animate={{ boxShadow: ['0 0 0px rgba(255,107,53,0)', '0 0 30px rgba(255,107,53,0.3)', '0 0 0px rgba(255,107,53,0)'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                AI
              </motion.span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                AnalyticsHub
              </span>
            </div>

            {/* Loading bar */}
            <div className="h-[2px] w-48 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              className="text-xs tracking-[0.2em] text-muted uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Initializing Analytics Workspace...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
