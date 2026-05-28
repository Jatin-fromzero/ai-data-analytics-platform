'use client';

import React from 'react';
import Link from 'next/link';
import { PageReveal, FadeUp } from '@/components/ui/motion';
import { siteConfig } from '@/config/site';

const LAST_UPDATED = 'May 28, 2026';

export default function TermsPage() {
  return (
    <PageReveal>
      <div className="pb-24 overflow-hidden">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 text-center bg-slate-950/20 border-b border-white/[0.03]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand/8 to-transparent rounded-full blur-[140px] pointer-events-none" />

          <FadeUp>
            <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-450 leading-[0.95]">
                Terms of Service
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

              {/* 1. Acceptance */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">1</span>
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing or using the {siteConfig.name} platform (&quot;Platform&quot;), including all associated websites, mobile applications, and services, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not access or use the Platform.
                </p>
                <p>
                  We reserve the right to update these Terms at any time. Continued use of the Platform following any changes constitutes your acceptance of the revised Terms. We will notify registered users of material changes via email or in-app notification.
                </p>
              </div>

              {/* 2. Eligibility */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">2</span>
                  Eligibility
                </h2>
                <p>
                  You must be at least 16 years of age to use the Platform. If you are under 18, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. By using the Platform, you confirm that you have the legal capacity to enter into a binding agreement.
                </p>
              </div>

              {/* 3. Accounts */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">3</span>
                  User Accounts
                </h2>
                <p>
                  When you create an account, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p>
                  You agree to immediately notify us of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe have been compromised.
                </p>
              </div>

              {/* 4. Use of Platform */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">4</span>
                  Acceptable Use
                </h2>
                <p>You agree not to:</p>
                <ul className="list-none space-y-3 pl-2">
                  {[
                    'Use the Platform for any unlawful purpose or in violation of any applicable laws or regulations.',
                    'Reproduce, redistribute, or resell any course content, materials, or proprietary assets without explicit written permission.',
                    'Attempt to reverse-engineer, decompile, or interfere with the Platform\'s underlying software, infrastructure, or security mechanisms.',
                    'Share your account credentials with others or allow multiple individuals to access the Platform under a single account.',
                    'Upload or transmit any content that is harmful, offensive, defamatory, or infringes on the intellectual property rights of others.',
                    'Use automated scripts, bots, or scraping tools to extract data from the Platform.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Intellectual Property */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">5</span>
                  Intellectual Property
                </h2>
                <p>
                  All content on the Platform — including but not limited to course materials, text, graphics, logos, icons, images, video, audio, software, and code — is the exclusive property of {siteConfig.name} or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform content for personal, non-commercial educational purposes only.
                </p>
              </div>

              {/* 6. Payments & Refunds */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">6</span>
                  Payments &amp; Refunds
                </h2>
                <p>
                  Certain features of the Platform may require payment. All fees are stated in Indian Rupees (INR) unless otherwise specified. Payments are processed through secure third-party payment gateways.
                </p>
                <p>
                  Refund requests must be submitted within 7 days of purchase. Refunds are granted at our sole discretion and may be denied if significant course progress has been made or downloadable content has been accessed.
                </p>
              </div>

              {/* 7. AI Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">7</span>
                  AI-Powered Features
                </h2>
                <p>
                  The Platform integrates AI-powered mentoring and assistance tools. Responses generated by AI are provided for educational guidance only and should not be treated as professional, legal, financial, or medical advice. We do not guarantee the accuracy, completeness, or reliability of AI-generated content.
                </p>
              </div>

              {/* 8. Limitation of Liability */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">8</span>
                  Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by applicable law, {siteConfig.name} and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the Platform.
                </p>
                <p>
                  The Platform is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, either express or implied.
                </p>
              </div>

              {/* 9. Termination */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">9</span>
                  Termination
                </h2>
                <p>
                  We may suspend or terminate your access to the Platform at any time, with or without cause or notice, including for violations of these Terms. Upon termination, your right to use the Platform ceases immediately. Sections relating to intellectual property, limitation of liability, and governing law shall survive termination.
                </p>
              </div>

              {/* 10. Governing Law */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">10</span>
                  Governing Law
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                </p>
              </div>

              {/* 11. Contact */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-xs font-black shrink-0">11</span>
                  Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our{' '}
                  <Link href="/contact" className="text-brand hover:text-brand/80 underline underline-offset-4 transition-colors">
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
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand/80 transition-colors"
                >
                  Read our Privacy Policy
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
