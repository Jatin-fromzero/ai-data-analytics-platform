'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIMentorChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export function AIMentorChat({ isOpen, onClose, initialMessage }: AIMentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Career Mentor. I can help you understand the curriculum, plan your career path, or answer questions about data analytics. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial message from visual bubbles
  useEffect(() => {
    if (isOpen && initialMessage) {
      handleSendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: data.role, content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural network right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] flex w-full flex-col border-l border-border/60 bg-background shadow-2xl sm:max-w-md lg:max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                  <span className="h-2 w-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">AI Mentor</h2>
                  <p className="text-xs text-brand font-medium">Online</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted hover:bg-slate-800/60 hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand text-foreground rounded-br-sm' 
                        : 'bg-surface border border-border/60 text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-center gap-2 rounded-2xl rounded-bl-sm bg-surface border border-border/60 px-5 py-4">
                    <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
                    <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
                    <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-brand" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/60 bg-background p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex items-end gap-3 rounded-2xl border border-border/80 bg-surface/50 p-2 focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/20 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about courses, career paths..."
                  className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 shrink-0 rounded-xl px-0 flex items-center justify-center"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </form>
              <p className="mt-3 text-center text-[10px] text-muted">
                AI Mentor can make mistakes. Consider verifying important career advice.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
