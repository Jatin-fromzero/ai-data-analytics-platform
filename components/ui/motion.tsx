'use client';

/**
 * Motion primitives — centralized animation wrappers.
 * All variants are subtle and respect prefers-reduced-motion.
 * Uses Framer Motion v11 API.
 */

import React from 'react';
import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';

// ─── Shared config ────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as const; // cubic-bezier — Apple-like

// ─── FadeUp ───────────────────────────────────────────────────────────────────
// Subtle fade + upward translate. Primary entrance pattern.

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

interface FadeUpProps extends HTMLMotionProps<'div'> {
  delay?: number;
  children: React.ReactNode;
}

export function FadeUp({ delay = 0, children, ...props }: FadeUpProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── ScrollReveal ─────────────────────────────────────────────────────────────
// Triggers fade-up once element enters viewport. Fires once only.

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
  amount = 0.15,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer + StaggerItem ──────────────────────────────────────────
// Staggered children reveal. Clean orchestrated entrance.

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className, delay = 0 }: StaggerContainerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

// ─── HoverCard ────────────────────────────────────────────────────────────────
// Subtle lift + border glow on hover. For project/feature cards.

export function HoverCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── PageReveal ───────────────────────────────────────────────────────────────
// Wraps page-level content with a smooth entrance.

export function PageReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
