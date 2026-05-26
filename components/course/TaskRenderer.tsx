'use client';

import React, { useState } from 'react';
import { TaskBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface TaskRendererProps {
  block: TaskBlock;
}

export function TaskRenderer({ block }: TaskRendererProps) {
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (key: string) => {
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="my-6 space-y-4">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono mb-4">
          {block.title}
        </h4>
      )}

      {/* Task selector bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {block.tasks.map((task, i) => {
          const accent = getAccentClasses(task.color);
          const isActive = activeTask === i;
          return (
            <button
              key={i}
              onClick={() => setActiveTask(isActive ? null : i)}
              className={cn(
                'rounded-xl border py-3 px-4 text-left transition-all min-w-[130px] shrink-0',
                isActive
                  ? `${accent.twBorder} ${accent.twBg}`
                  : 'border-border/40 bg-surface/30 hover:bg-surface/50'
              )}
              style={{ borderTopWidth: '3px' }}
            >
              <div className={cn('text-xs font-mono font-bold mb-1', isActive ? accent.twText : 'text-muted')}>
                {task.id}
              </div>
              <div className="text-xs text-foreground font-bold truncate">{task.title}</div>
              <div className="text-[10px] text-muted mt-1">{task.weight} pts</div>
            </button>
          );
        })}
      </div>

      {/* Active task detail */}
      {activeTask !== null && (() => {
        const task = block.tasks[activeTask];
        const accent = getAccentClasses(task.color);

        return (
          <div className={cn('rounded-2xl border overflow-hidden animate-in fade-in duration-300', accent.twBorder)}>
            {/* Task header */}
            <div className={cn('px-5 py-4 border-b', accent.twBg, accent.twBorder)}>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <span className={cn('text-[9px] font-mono font-bold tracking-wider', accent.twText)}>
                    {task.id} · {task.weight} MARKS
                  </span>
                  <h3 className="text-lg font-extrabold text-foreground mt-1">{task.title}</h3>
                </div>
                <p className="text-xs text-muted italic max-w-[280px] text-right">
                  {task.objective}
                </p>
              </div>
            </div>

            {/* Task body */}
            <div className="px-5 py-5 space-y-5 bg-surface/20">
              {/* Step-by-step checklist */}
              <div>
                <span className={cn('text-[9px] font-bold uppercase tracking-[0.18em] font-mono', accent.twText)}>
                  STEP-BY-STEP INSTRUCTIONS
                </span>
                <div className="flex flex-col gap-2 mt-3">
                  {task.steps.map((step, j) => {
                    const key = `${activeTask}-${j}`;
                    const isDone = checkedSteps[key];
                    return (
                      <div
                        key={j}
                        onClick={() => toggleStep(key)}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200',
                          isDone
                            ? `${accent.twBorder} ${accent.twBg}`
                            : 'border-border/30 bg-surface/20 hover:bg-surface/40'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                          isDone ? `${accent.twBorder} ${accent.twBg}` : 'border-border/50'
                        )}>
                          {isDone && <span className={cn('text-[9px] font-bold', accent.twText)}>✓</span>}
                        </div>
                        <span className={cn(
                          'text-sm leading-relaxed',
                          isDone ? 'text-foreground' : 'text-slate-400'
                        )}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Prompts */}
              {task.aiPrompts.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-purple-400">
                    🤖 AI PROMPTS FOR THIS TASK
                  </span>
                  <div className="flex flex-col gap-2 mt-3">
                    {task.aiPrompts.map((prompt, j) => (
                      <div
                        key={j}
                        className="rounded-xl border border-purple-400/20 bg-purple-400/5 px-4 py-3"
                      >
                        <code className="text-xs font-mono text-purple-300 leading-relaxed">
                          {prompt}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverable */}
              <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-brand">
                  📦 DELIVERABLE
                </span>
                <p className="mt-1.5 text-sm text-foreground font-medium">{task.deliverable}</p>
              </div>

              {/* Rubric criteria */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-amber-400">
                  🎯 MARKING CRITERIA
                </span>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {task.rubric.map((criterion, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                      <span className="text-amber-400 shrink-0 mt-0.5">▸</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
