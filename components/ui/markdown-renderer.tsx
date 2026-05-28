'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, Flame, AlertTriangle } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  // Extremely robust, clean, light-weight customized markdown block parser
  const parseMarkdownToBlocks = (text: string) => {
    // Standardize newlines
    const rawLines = text.split(/\r?\n/);
    const blocks: React.ReactNode[] = [];
    let key = 0;

    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';

    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        blocks.push(
          <ul key={`ul-${key++}`} className="list-disc pl-6 space-y-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed my-4">
            {listItems}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        const rawCode = codeBlockContent.join('\n');
        blocks.push(
          <div key={`code-${key++}`} className="relative group my-6 border border-white/5 rounded-2xl bg-[#09090D] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#0C0C12] border-b border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{codeBlockLang || 'code'}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(rawCode)} 
                className="text-[10px] font-medium text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Copy
              </button>
            </div>
            <pre className="p-5 overflow-x-auto text-[11px] sm:text-xs font-mono text-emerald-400 leading-relaxed scrollbar-hide">
              <code>{rawCode}</code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        codeBlockLang = '';
      }
      inCodeBlock = false;
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // 1. Code Blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          inCodeBlock = true;
          codeBlockLang = trimmed.substring(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // 2. Alert blocks & Blockquotes
      if (trimmed.startsWith('>')) {
        flushList();
        
        // Parse alert type (e.g. > [!NOTE], > [!IMPORTANT])
        let alertType: 'note' | 'tip' | 'important' | 'warning' | 'caution' | null = null;
        let alertContent = trimmed.substring(1).trim();

        if (alertContent.startsWith('[!NOTE]')) {
          alertType = 'note';
          alertContent = alertContent.substring(7).trim();
        } else if (alertContent.startsWith('[!TIP]')) {
          alertType = 'tip';
          alertContent = alertContent.substring(6).trim();
        } else if (alertContent.startsWith('[!IMPORTANT]')) {
          alertType = 'important';
          alertContent = alertContent.substring(12).trim();
        } else if (alertContent.startsWith('[!WARNING]')) {
          alertType = 'warning';
          alertContent = alertContent.substring(10).trim();
        } else if (alertContent.startsWith('[!CAUTION]')) {
          alertType = 'caution';
          alertContent = alertContent.substring(10).trim();
        }

        // Peek next lines to consume full quote block
        while (i + 1 < rawLines.length && rawLines[i + 1].trim().startsWith('>')) {
          i++;
          const nextLineContent = rawLines[i].trim().substring(1).trim();
          alertContent += ' ' + nextLineContent;
        }

        // Render premium custom alert cards matching Apple/Stripe visual systems
        const alertStyles = {
          note: 'border-blue-500/20 bg-blue-500/[0.02] text-blue-300',
          tip: 'border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-300',
          important: 'border-brand/20 bg-brand/[0.02] text-brand',
          warning: 'border-amber-500/20 bg-amber-500/[0.02] text-amber-300',
          caution: 'border-rose-500/20 bg-rose-500/[0.02] text-rose-300'
        };

        const alertIcons = {
          note: <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />,
          tip: <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />,
          important: <Flame className="h-4.5 w-4.5 text-brand shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />,
          caution: <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
        };

        const activeStyle = alertType ? alertStyles[alertType] : 'border-white/5 bg-white/[0.01] text-slate-300';
        const activeIcon = alertType ? alertIcons[alertType] : <Info className="h-4.5 w-4.5 text-brand shrink-0 mt-0.5" />;

        blocks.push(
          <div key={`alert-${key++}`} className={cn("p-5 my-6 rounded-2xl border flex gap-3.5 relative overflow-hidden backdrop-blur-md shadow-sm", activeStyle)}>
            {activeIcon}
            <div className="text-xs sm:text-sm font-light leading-relaxed relative z-10">
              {parseInlineMarkdown(alertContent)}
            </div>
          </div>
        );
        continue;
      }

      // 3. Headers
      if (trimmed.startsWith('#')) {
        flushList();
        
        let depth = 0;
        while (trimmed[depth] === '#') depth++;
        const headerText = trimmed.substring(depth).trim();

        if (depth === 1) {
          blocks.push(
            <h1 key={`h1-${key++}`} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-10 mb-5 pb-3 border-b border-white/5 leading-snug">
              {parseInlineMarkdown(headerText)}
            </h1>
          );
        } else if (depth === 2) {
          blocks.push(
            <h2 key={`h2-${key++}`} className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-8 mb-4 leading-snug">
              {parseInlineMarkdown(headerText)}
            </h2>
          );
        } else {
          blocks.push(
            <h3 key={`h3-${key++}`} className="text-base sm:text-lg font-semibold tracking-tight text-slate-100 mt-6 mb-3">
              {parseInlineMarkdown(headerText)}
            </h3>
          );
        }
        continue;
      }

      // 4. Bullet lists
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        inList = true;
        const itemContent = trimmed.substring(1).trim();
        listItems.push(
          <li key={`li-${key++}`} className="relative pl-1">
            {parseInlineMarkdown(itemContent)}
          </li>
        );
        continue;
      }

      // 5. Empty lines
      if (!trimmed) {
        flushList();
        continue;
      }

      // 6. Regular Paragraphs
      flushList();
      blocks.push(
        <p key={`p-${key++}`} className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed my-4.5">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }

    // Flush any remaining tags
    flushList();
    flushCodeBlock();

    return blocks;
  };

  // Support inline styling: **bold**, *italic*, `inline code`
  const parseInlineMarkdown = (text: string) => {
    if (!text) return '';

    const parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    // Helper regex to split inline elements sequentially
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const splitParts = currentText.split(inlineRegex);

    return splitParts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-white">{part.substring(2, part.length - 2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-slate-200">{part.substring(1, part.length - 1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-[#0F0F16] border border-white/5 text-[11px] sm:text-xs font-mono text-emerald-400">
            {part.substring(1, part.length - 1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn("prose prose-invert max-w-none text-slate-300", className)}>
      {parseMarkdownToBlocks(content)}
    </div>
  );
}
