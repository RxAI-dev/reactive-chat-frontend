'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Send,
  ThinkingIcon,
  Zap,
  Wrench,
  ChevronDown,
  ChevronUp,
  Search,
  Code,
  Calculator,
  File,
  ImageIcon,
  Check,
} from '@/components/ui/icons';
import { Tool } from '@/types';

// Tool icon mapping
const toolIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  search: Search,
  code: Code,
  calculator: Calculator,
  file: File,
  image: ImageIcon,
};

interface ChatInputProps {
  onSend: (message: string, useThinking: boolean, selectedTools?: string[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { settings, streaming, availableTools, toggleTool } = useAppStore();
  const [message, setMessage] = useState('');
  const [reasoningMode, setReasoningMode] = useState(settings.defaultReasoningMode);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  const [selectedToolsForMessage, setSelectedToolsForMessage] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolMenuRef = useRef<HTMLDivElement>(null);

  // Get enabled tools from settings (with defensive check for undefined)
  const enabledToolIds = settings.enabledTools || [];
  const enabledTools = availableTools.filter((tool) =>
    enabledToolIds.includes(tool.id)
  );

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Close tool menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolMenuRef.current && !toolMenuRef.current.contains(event.target as Node)) {
        setIsToolMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      // Pass selected tools if any are selected
      const toolsToUse = selectedToolsForMessage.length > 0 ? selectedToolsForMessage : undefined;
      onSend(message.trim(), mode === 'extended', toolsToUse);
      setMessage('');
      setSelectedToolsForMessage([]);
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

  const toggleToolForMessage = (toolId: string) => {
    setSelectedToolsForMessage((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getToolIcon = (iconName: string) => {
    return toolIcons[iconName] || Wrench;
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--background)] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mode and Tools selector row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Reasoning mode toggle - left side */}
          <div className="flex items-center gap-2">
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

          {/* Tools selector - right side */}
          <div className="relative" ref={toolMenuRef}>
            <button
              onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${
                  selectedToolsForMessage.length > 0
                    ? 'bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)]'
                }
              `}
              disabled={enabledTools.length === 0}
            >
              <Wrench size={14} />
              <span>Tools</span>
              {selectedToolsForMessage.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--accent-blue)] text-white">
                  {selectedToolsForMessage.length}
                </span>
              )}
              {isToolMenuOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Tools dropdown menu */}
            {isToolMenuOpen && enabledTools.length > 0 && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-2 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Select tools for this message
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {enabledTools.map((tool) => {
                    const ToolIcon = getToolIcon(tool.icon);
                    const isSelected = selectedToolsForMessage.includes(tool.id);
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleToolForMessage(tool.id)}
                        className={`
                          w-full flex items-center gap-3 p-3 text-left transition-colors
                          ${isSelected ? 'bg-[var(--accent-blue-bg)]' : 'hover:bg-[var(--sidebar-item-hover)]'}
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${isSelected ? 'bg-[var(--accent-blue)]' : 'bg-[var(--background-secondary)]'}
                        `}>
                          <ToolIcon size={16} className={isSelected ? 'text-white' : 'text-[var(--foreground-muted)]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isSelected ? 'text-[var(--accent-blue)]' : 'text-[var(--foreground)]'}`}>
                            {tool.name}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] truncate">
                            {tool.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check size={16} className="text-[var(--accent-blue)] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {enabledTools.length === 0 && (
                  <div className="p-4 text-center text-sm text-[var(--foreground-muted)]">
                    No tools enabled. Enable tools in Settings.
                  </div>
                )}
              </div>
            )}
          </div>
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
