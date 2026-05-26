'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizRendererProps {
  quiz: QuizQuestion[];
}

export function QuizRenderer({ quiz }: QuizRendererProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const currentQ = quiz[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isAnswered) return;
    
    const isCorrect = selectedOpt === currentQ.answer;
    if (isCorrect) setScore((prev) => prev + 1);
    
    setIsAnswered(true);
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= quiz.length) {
      setIsDone(true);
    } else {
      setCurrentIdx(nextIdx);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setIsDone(false);
  };

  if (isDone) {
    const scorePct = Math.round((score / quiz.length) * 100);
    return (
      <Card className="border border-border/80 bg-surface/50 p-8 text-center rounded-[2rem] max-w-lg mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="text-5xl">🏆</div>
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-foreground">Quiz Completed!</h4>
            <p className="text-sm text-muted">Review your performance diagnostics below.</p>
          </div>

          <div className="inline-flex items-center justify-center p-6 rounded-full bg-brand/10 border-2 border-brand/20 h-28 w-28">
            <span className="text-2xl font-bold font-mono text-brand">{scorePct}%</span>
          </div>

          <p className="text-base text-slate-300">
            You correctly answered <strong className="text-foreground">{score}</strong> out of <strong className="text-foreground">{quiz.length}</strong> questions.
          </p>

          <Button onClick={handleRestart} className="w-full h-11 rounded-full shadow-glow">
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface/40 p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
      <div className="space-y-6">
        {/* Progress tracker */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-brand font-mono">
          <span>Module Quiz Diagnostics</span>
          <span>Question {currentIdx + 1} of {quiz.length}</span>
        </div>

        {/* Question text */}
        <h4 className="text-lg font-bold text-foreground leading-snug">
          {currentQ.q}
        </h4>

        {/* Options list */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrectAnswer = currentQ.answer === idx;
            
            let btnStyle = "border-border/60 bg-surface hover:border-brand/45 hover:bg-surface-2 text-slate-200";
            if (isSelected) {
              btnStyle = "border-brand bg-brand/10 text-brand";
            }
            if (isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              } else if (isSelected) {
                btnStyle = "border-red-500 bg-red-500/10 text-red-400";
              } else {
                btnStyle = "border-border/40 bg-surface/20 text-muted opacity-50";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={cn(
                  "w-full flex items-center gap-4 text-left p-4 rounded-2xl border text-sm font-semibold transition-all duration-200 focus:outline-none",
                  btnStyle
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/50 text-[10px] font-mono shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Action button */}
        {!isAnswered ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedOpt === null}
            className="w-full h-11 rounded-full shadow-glow"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Explanation card */}
            <div className={cn(
              "rounded-2xl border p-5 space-y-2",
              selectedOpt === currentQ.answer 
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                : "border-red-500/20 bg-red-500/5 text-red-450 text-red-450"
            )}>
              <p className="text-[10px] font-bold uppercase tracking-wider">
                {selectedOpt === currentQ.answer ? '✓ Correct Answer' : '✗ Incorrect Answer'}
              </p>
              <p className="text-xs leading-relaxed text-slate-300">
                {currentQ.explanation}
              </p>
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full h-11 rounded-full bg-surface border border-border hover:bg-surface-2 text-foreground"
            >
              {currentIdx + 1 === quiz.length ? 'Finish Diagnostics' : 'Next Question'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
