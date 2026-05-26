'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AIMentorVisual() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[450px]">
      {/* ── Visual Wrapper ────────────────────────────────────────── */}
      <motion.div 
        className="relative w-full max-w-[500px] aspect-[4/3] mx-auto select-none group"
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-brand/10 blur-[80px] rounded-full mix-blend-screen group-hover:bg-brand/20 transition-colors duration-700" />

        {/* ── Layer 1: Main Analytics Dashboard (Back) ──────────────────── */}
        <motion.div 
          className="absolute inset-x-4 top-8 bottom-12 rounded-2xl border border-border bg-surface/60 backdrop-blur-xl shadow-2xl overflow-hidden"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Mock Header */}
          <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="mx-auto h-4 w-32 rounded bg-border/50" />
          </div>
          
          {/* Mock Chart Area */}
          <div className="p-6 h-full flex flex-col gap-4">
            <div className="flex justify-between items-end h-32 gap-3 opacity-60">
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <motion.div 
                  key={i}
                  className="w-full bg-brand/40 rounded-t-sm"
                  style={{ height: `${h}%` }}
                  animate={{ height: [`${h}%`, `${Math.max(10, h - 20)}%`, `${h}%`] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <div className="h-4 w-1/3 rounded bg-border/50 mt-auto" />
            <div className="h-4 w-2/3 rounded bg-border/30" />
          </div>
        </motion.div>

        {/* ── Layer 2: Floating SQL Snippet (Left) ──────────────────────── */}
        <motion.div 
          className="absolute -left-6 top-1/4 rounded-xl border border-border/60 bg-surface/90 backdrop-blur-md p-4 shadow-xl z-10"
          animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-brand">query.sql</span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <p className="text-emerald-400">SELECT <span className="text-foreground">user_id,</span></p>
            <p className="text-foreground pl-4">SUM(revenue) <span className="text-amber-400">as</span> total</p>
            <p className="text-emerald-400">FROM <span className="text-foreground">sales_data</span></p>
            <p className="text-emerald-400">GROUP BY <span className="text-foreground">1;</span></p>
          </div>
        </motion.div>

        {/* ── Layer 3: Floating KPI Card (Right) ────────────────────────── */}
        <motion.div 
          className="absolute -right-4 bottom-1/4 rounded-xl border border-border/60 bg-surface/90 backdrop-blur-md p-4 shadow-xl z-10 min-w-[140px]"
          animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <p className="text-xs text-muted mb-1 font-medium">Revenue Growth</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">+124.5%</p>
          <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, delay: 1 }}
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
