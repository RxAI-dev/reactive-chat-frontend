'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import {Brain, Send, ThinkingIcon, Zap} from '@/components/ui/icons';

interface ChatInputProps {
  onSend: (message: string, useThinking: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { settings, streaming } = useAppStore();
  const [message, setMessage] = useState('');
  const [reasoningMode, setReasoningMode] = useState(settings.defaultReasoningMode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled && !streaming.isStreaming) {
      let mode = reasoningMode;
      if (reasoningMode === 'auto') {
        if (Math.random() < 0.5) {
          mode = 'extended';
        } else {
          mode = 'fast';
        }
      }

      onSend(message.trim(), mode === 'extended');
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--background)] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Reasoning mode toggle */}
        <div className="flex items-center gap-2 mb-3">
          <button
              onClick={() => setReasoningMode('auto')}
              className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                  reasoningMode === 'auto'
                      ? 'bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)]'
              }
            `}
          >
            <ThinkingIcon size={14} />
            <span>Auto</span>
          </button>
          <button
            onClick={() => setReasoningMode('fast')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                reasoningMode === 'fast'
                  ? 'bg-[var(--accent-green-bg)] text-[var(--accent-green)]'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)]'
              }
            `}
          >
            <Zap size={14} />
            <span>Fast Answer</span>
          </button>
          <button
            onClick={() => setReasoningMode('extended')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                reasoningMode === 'extended'
                  ? 'bg-[var(--accent-purple-bg)] text-[var(--accent-purple)]'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)]'
              }
            `}
          >
            <Brain size={14} />
            <span>Extended Thinking</span>
          </button>
        </div>

        {/* Input area */}
        <div className="relative flex items-end gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-2 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              reasoningMode === 'extended'
                ? 'Ask a question (Extended Thinking enabled)...'
                : 'Ask a question...'
            }
            disabled={disabled || streaming.isStreaming}
            rows={1}
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] resize-none focus:outline-none px-2 py-1.5 max-h-[200px]"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!message.trim() || disabled || streaming.isStreaming}
            className="flex-shrink-0"
          >
            {streaming.isStreaming ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>

        {/* Info text */}
        <p className="mt-2 text-xs text-[var(--foreground-muted)] text-center">
          {reasoningMode === 'extended' ? (
            <>
              <span className="text-[var(--accent-purple)]">[T]</span> Extended thinking mode
              enabled - model will show reasoning process
            </>
          ) : reasoningMode === 'fast' ? (
            <>
              <span className="text-[var(--accent-green)]">[A]</span> Fast answer mode - direct
              response without extended reasoning
            </>
          ) : (
              <>
                <span className="text-[var(--accent-blue)]">[A/T]</span> Auto routing mode - model
                decide which mode to use based on query
              </>
          )}
        </p>
      </div>
    </div>
  );
}
