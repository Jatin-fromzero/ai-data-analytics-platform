'use client';

import React from 'react';
import Link from 'next/link';
import { PageReveal, FadeUp } from '@/components/ui/motion';
import { siteConfig } from '@/config/site';

const LAST_UPDATED = 'May 28, 2026';

export default function PrivacyPage() {
  return (
    <PageReveal>
      <div className="pb-24 overflow-hidden">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 text-center bg-slate-950/20 border-b border-white/[0.03]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-500/8 to-transparent rounded-full blur-[140px] pointer-events-none" />

          <FadeUp>
            <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-450 leading-[0.95]">
                Privacy Policy
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-6 pt-16">
          <FadeUp delay={0.1}>
            <div className="space-y-12 text-sm sm:text-base text-slate-400 leading-relaxed font-light">

              {/* Intro */}
              <div className="space-y-4">
                <p>
                  At {siteConfig.name}, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our platform, website, and services (collectively, the &quot;Platform&quot;). By using the Platform, you consent to the practices described in this policy.
                </p>
              </div>

              {/* 1. Information We Collect */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">1</span>
                  Information We Collect
                </h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">a) Information You Provide</h3>
                    <ul className="list-none space-y-2.5 pl-2">
                      {[
                        'Account information: Full name, email address, and password when you sign up.',
                        'Profile details: Any additional profile information you choose to provide.',
                        'Payment information: Billing details processed securely through third-party payment providers. We do not store your full credit/debit card numbers.',
                        'Communications: Messages, feedback, or support queries you send to us.',
                        'Course interactions: Assignments, projects, quiz submissions, and code you write within the Platform.',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">b) Automatically Collected Information</h3>
                    <ul className="list-none space-y-2.5 pl-2">
                      {[
                        'Device and browser information: Device type, operating system, browser type and version.',
                        'Usage data: Pages visited, features used, time spent, click patterns, and navigation paths.',
                        'IP address and approximate geographic location.',
                        'Cookies and similar tracking technologies (see Section 6).',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. How We Use Your Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">2</span>
                  How We Use Your Information
                </h2>
                <p>We use your information to:</p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Provide, maintain, and improve the Platform and its features.',
                    'Personalize your learning experience, including AI-powered recommendations and mentoring.',
                    'Process payments and manage your subscriptions or course enrollments.',
                    'Communicate with you about account updates, new features, and educational content.',
                    'Analyze usage trends to improve our services, content, and user experience.',
                    'Detect, prevent, and address fraud, abuse, and security issues.',
                    'Comply with legal obligations and enforce our Terms of Service.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. AI Features & Data */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">3</span>
                  AI Features &amp; Your Data
                </h2>
                <p>
                  Our Platform uses AI-powered tools (including the AI Mentor) to enhance your learning experience. When you interact with AI features:
                </p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Your queries and inputs may be processed by third-party AI providers (such as Google Gemini) to generate responses.',
                    'We do not use your personal conversations with the AI Mentor to train or fine-tune third-party AI models.',
                    'Conversation data may be temporarily stored to provide session continuity and improve the quality of responses.',
                    'You can delete your AI conversation history at any time through your account settings.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Data Sharing */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">4</span>
                  Data Sharing &amp; Third Parties
                </h2>
                <p>
                  We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Service providers: Trusted third parties who assist us in operating the Platform (hosting, payment processing, email delivery, analytics). These providers are bound by contractual confidentiality obligations.',
                    'Legal requirements: When required by law, court order, or governmental regulation, or to protect the rights, property, or safety of our users or the public.',
                    'Business transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Data Security */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">5</span>
                  Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your information, including:
                </p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Encryption of data in transit (TLS/HTTPS) and at rest.',
                    'Secure password hashing using bcrypt.',
                    'Regular security audits and vulnerability assessments.',
                    'Role-based access controls for internal systems.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  While we take reasonable precautions, no method of data transmission or storage is completely secure. You use the Platform at your own risk.
                </p>
              </div>

              {/* 6. Cookies */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">6</span>
                  Cookies &amp; Tracking
                </h2>
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Maintain your authenticated session and preferences.',
                    'Analyze traffic patterns and Platform performance.',
                    'Remember your theme preference (light/dark mode).',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  You can control or disable cookies through your browser settings. Note that disabling essential cookies may affect Platform functionality.
                </p>
              </div>

              {/* 7. Data Retention */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">7</span>
                  Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as your account is active or as needed to provide services. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (such as fraud prevention or resolving disputes).
                </p>
              </div>

              {/* 8. Your Rights */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">8</span>
                  Your Rights
                </h2>
                <p>Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-none space-y-2.5 pl-2">
                  {[
                    'Access: Request a copy of the personal data we hold about you.',
                    'Correction: Request correction of inaccurate or incomplete data.',
                    'Deletion: Request deletion of your personal data, subject to legal exceptions.',
                    'Data portability: Request your data in a machine-readable format.',
                    'Opt-out: Unsubscribe from marketing communications at any time.',
                    'Withdraw consent: Where processing is based on consent, withdraw your consent at any time.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  To exercise any of these rights, please contact us through our{' '}
                  <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors">
                    Contact page
                  </Link>.
                </p>
              </div>

              {/* 9. Children's Privacy */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">9</span>
                  Children&apos;s Privacy
                </h2>
                <p>
                  The Platform is not intended for children under 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected data from a child under 16 without parental consent, we will take steps to delete that information promptly.
                </p>
              </div>

              {/* 10. Changes */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">10</span>
                  Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. When we make material changes, we will notify registered users via email or a prominent notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.
                </p>
              </div>

              {/* 11. Contact */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-black shrink-0">11</span>
                  Contact Us
                </h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out through our{' '}
                  <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors">
                    Contact page
                  </Link>.
                </p>
              </div>

              {/* Divider & related link */}
              <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-600">
                  © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </p>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Read our Terms of Service
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

            </div>
          </FadeUp>
        </section>
      </div>
    </PageReveal>
  );
}
