'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Interaction, ToolCallMessage, ToolUseMessage, ToolResultData } from '@/types';
import {
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ThinkingIcon,
  Terminal,
  RefreshCw,
  Wrench,
} from '@/components/ui/icons';

interface InteractionDisplayProps {
  interaction: Interaction;
  isStreaming?: boolean;
  streamingPhase?: 'thinking' | 'answer' | 'tool_call' | 'tool_result' | null;
}

export function InteractionDisplay({
  interaction,
  isStreaming = false,
  streamingPhase = null,
}: InteractionDisplayProps) {
  // Handle 'tool_result' type interactions (initiated by tool results)
  if (interaction.type === 'tool_result' && interaction.toolUse) {
    return (
      <div className="animate-slideIn">
        {/* Tool Use (Tool results that initiated this interaction) */}
        <ToolUseDisplay
          toolUse={interaction.toolUse}
          isStreaming={isStreaming && streamingPhase === 'tool_result'}
        />

        {/* Thinking (if present) */}
        {interaction.thinking && (
          <ThinkingMessage
            content={interaction.thinking.content}
            isStreaming={isStreaming && streamingPhase === 'thinking'}
          />
        )}

        {/* Answer (summary of tool results) */}
        {interaction.answer && (
          <AnswerMessage
            content={interaction.answer.content}
            timestamp={interaction.answer.timestamp}
            isStreaming={isStreaming && streamingPhase === 'answer'}
          />
        )}

        {/* Chained tool calls (if present) */}
        {interaction.toolCalls?.map((toolCall) => (
          <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
        ))}
      </div>
    );
  }

  // Handle 'query' type interactions (initiated by user query)
  return (
    <div className="animate-slideIn">
      {/* Query (User message) */}
      {interaction.query && (
        <QueryMessage content={interaction.query.content} timestamp={interaction.query.timestamp} />
      )}

      {/* Thinking (if present) */}
      {interaction.thinking && (
        <ThinkingMessage
          content={interaction.thinking.content}
          isStreaming={isStreaming && streamingPhase === 'thinking'}
        />
      )}

      {/* Answer */}
      {interaction.answer && (
        <AnswerMessage
          content={interaction.answer.content}
          timestamp={interaction.answer.timestamp}
          isStreaming={isStreaming && streamingPhase === 'answer'}
        />
      )}

      {/* Tool calls (triggers next tool_result interaction) */}
      {interaction.toolCalls?.map((toolCall) => (
        <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
      ))}
    </div>
  );
}

interface QueryMessageProps {
  content: string;
  timestamp: Date;
}

function QueryMessage({ content, timestamp }: QueryMessageProps) {
  return (
    <div className="flex gap-3 p-4 bg-[var(--chat-user-bg)] rounded-lg mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-red)] flex items-center justify-center flex-shrink-0">
        <User size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--foreground)]">You</span>
          <span className="text-xs text-[var(--foreground-muted)]">
            {format(new Date(timestamp), 'HH:mm')}
          </span>
        </div>
        <div className="message-content text-[var(--foreground)]">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

interface ThinkingMessageProps {
  content: string;
  isStreaming?: boolean;
}

function ThinkingMessage({ content, isStreaming = false }: ThinkingMessageProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-3 ml-11">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--chat-thinking-bg)] hover:bg-[var(--accent-purple-bg)] transition-colors w-full text-left"
      >
        <ThinkingIcon size={16} className="text-[var(--accent-purple)]" />
        <span className="text-sm font-medium text-[var(--accent-purple)]">
          Extended Thinking
        </span>
        {isStreaming && (
          <span className="text-xs text-[var(--accent-purple)] animate-pulse">thinking...</span>
        )}
        {isExpanded ? (
          <ChevronDown size={14} className="text-[var(--accent-purple)] ml-auto" />
        ) : (
          <ChevronRight size={14} className="text-[var(--accent-purple)] ml-auto" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 px-4 py-3 rounded-lg bg-[var(--chat-thinking-bg)] border-l-2 border-[var(--accent-purple)]">
          <pre className={`text-sm text-[var(--foreground-secondary)] whitespace-pre-wrap font-sans ${isStreaming ? 'streaming-cursor' : ''}`}>
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

interface AnswerMessageProps {
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

function AnswerMessage({ content, timestamp, isStreaming = false }: AnswerMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 p-4 bg-[var(--chat-assistant-bg)] rounded-lg mb-3 group">
      <div className="w-8 h-8 rounded-full bg-[var(--accent-green-bg)] flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-[var(--accent-green)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--accent-green)]">RxT-Beta</span>
          <span className="text-xs text-[var(--foreground-muted)]">
            {format(new Date(timestamp), 'HH:mm')}
          </span>
          {isStreaming && (
            <span className="text-xs text-[var(--primary)] animate-pulse">generating...</span>
          )}
        </div>
        <div className={`message-content text-[var(--foreground)] ${isStreaming ? 'streaming-cursor' : ''}`}>
          {content.split('\n').map((paragraph, idx) => {
            // Handle markdown-like formatting
            if (paragraph.startsWith('### ')) {
              return <h3 key={idx}>{paragraph.slice(4)}</h3>;
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={idx}>{paragraph.slice(3)}</h2>;
            }
            if (paragraph.startsWith('# ')) {
              return <h1 key={idx}>{paragraph.slice(2)}</h1>;
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              return (
                <li key={idx} className="ml-4">
                  {formatInlineMarkdown(paragraph.slice(2))}
                </li>
              );
            }
            if (/^\d+\.\s/.test(paragraph)) {
              return (
                <li key={idx} className="ml-4 list-decimal">
                  {formatInlineMarkdown(paragraph.replace(/^\d+\.\s/, ''))}
                </li>
              );
            }
            if (paragraph.startsWith('```')) {
              return null; // Handle code blocks separately
            }
            if (paragraph.trim() === '') {
              return <br key={idx} />;
            }
            return <p key={idx}>{formatInlineMarkdown(paragraph)}</p>;
          })}
        </div>

        {/* Action buttons */}
        {!isStreaming && (
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-[var(--sidebar-item-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={14} className="text-[var(--accent-green)]" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to format inline markdown
function formatInlineMarkdown(text: string): React.ReactNode {
  // Handle bold text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    // Handle inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((codePart, codeIdx) => {
      if (codePart.startsWith('`') && codePart.endsWith('`')) {
        return <code key={`${idx}-${codeIdx}`}>{codePart.slice(1, -1)}</code>;
      }
      return codePart;
    });
  });
}

interface ToolCallDisplayProps {
  toolCall: ToolCallMessage;
  showResult?: boolean;
}

function ToolCallDisplay({ toolCall, showResult = false }: ToolCallDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasResult = toolCall.toolResult;
  const isExecuting = !hasResult;

  return (
    <div className="mb-3 ml-11">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--chat-tool-bg)] hover:bg-[var(--accent-blue-bg)] transition-colors w-full text-left"
      >
        <Terminal size={16} className="text-[var(--accent-blue)]" />
        <span className="text-sm font-medium text-[var(--accent-blue)]">
          Tool Call: {toolCall.toolName}
        </span>
        {isExecuting ? (
          <RefreshCw size={14} className="text-[var(--accent-blue)] ml-auto animate-spin" />
        ) : (
          <span className="text-xs text-[var(--foreground-muted)] ml-auto">
            awaiting result...
          </span>
        )}
        {isExpanded ? (
          <ChevronDown size={14} className="text-[var(--accent-blue)]" />
        ) : (
          <ChevronRight size={14} className="text-[var(--accent-blue)]" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {/* Tool arguments */}
          <div className="px-4 py-3 rounded-lg bg-[var(--background-tertiary)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Arguments:</p>
            <pre className="text-sm text-[var(--foreground-secondary)]">
              {JSON.stringify(toolCall.toolArgs, null, 2)}
            </pre>
          </div>

          {/* Tool result - only shown if showResult is true (legacy mode) */}
          {showResult && toolCall.toolResult && (
            <div
              className={`px-4 py-3 rounded-lg ${
                toolCall.toolResult.success
                  ? 'bg-[var(--accent-green-bg)]'
                  : 'bg-[var(--accent-red-bg)]'
              }`}
            >
              <p className="text-xs text-[var(--foreground-muted)] mb-1">Result:</p>
              <pre className="text-sm text-[var(--foreground-secondary)] whitespace-pre-wrap">
                {toolCall.toolResult.content}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Tool Use Display - Shows tool results that initiated a tool_result interaction
// Collapsed by default as per RxT interaction template
interface ToolUseDisplayProps {
  toolUse: ToolUseMessage;
  isStreaming?: boolean;
}

function ToolUseDisplay({ toolUse, isStreaming = false }: ToolUseDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toolCount = toolUse.toolResults.length;
  const allSuccessful = toolUse.toolResults.every((r) => r.result.success);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-colors
          ${allSuccessful
            ? 'bg-[var(--accent-green-bg)] hover:bg-[var(--accent-green-bg)]'
            : 'bg-[var(--accent-red-bg)] hover:bg-[var(--accent-red-bg)]'
          }
        `}
      >
        <Wrench size={16} className={allSuccessful ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'} />
        <span className={`text-sm font-medium ${allSuccessful ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
          Tool Results ({toolCount} {toolCount === 1 ? 'tool' : 'tools'})
        </span>
        {isStreaming && (
          <span className="text-xs animate-pulse ml-1">processing...</span>
        )}
        {allSuccessful ? (
          <Check size={14} className="text-[var(--accent-green)] ml-auto" />
        ) : (
          <RefreshCw size={14} className="text-[var(--accent-red)] ml-auto" />
        )}
        {isExpanded ? (
          <ChevronDown size={14} className={allSuccessful ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'} />
        ) : (
          <ChevronRight size={14} className={allSuccessful ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3 ml-4">
          {toolUse.toolResults.map((toolResult, index) => (
            <ToolResultItemDisplay key={toolResult.id} toolResult={toolResult} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual tool result display within ToolUseDisplay
interface ToolResultItemDisplayProps {
  toolResult: ToolResultData;
  index: number;
}

function ToolResultItemDisplay({ toolResult, index }: ToolResultItemDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--background-secondary)] w-full text-left"
      >
        <Terminal size={14} className="text-[var(--accent-blue)]" />
        <span className="text-sm font-medium text-[var(--foreground)]">
          {toolResult.toolName}
        </span>
        {toolResult.result.success ? (
          <Check size={12} className="text-[var(--accent-green)] ml-auto" />
        ) : (
          <RefreshCw size={12} className="text-[var(--accent-red)] ml-auto" />
        )}
        {isExpanded ? (
          <ChevronDown size={12} className="text-[var(--foreground-muted)]" />
        ) : (
          <ChevronRight size={12} className="text-[var(--foreground-muted)]" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 space-y-2 bg-[var(--background)]">
          {/* Tool arguments */}
          <div className="px-3 py-2 rounded bg-[var(--background-tertiary)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Arguments:</p>
            <pre className="text-xs text-[var(--foreground-secondary)]">
              {JSON.stringify(toolResult.toolArgs, null, 2)}
            </pre>
          </div>

          {/* Result */}
          <div
            className={`px-3 py-2 rounded ${
              toolResult.result.success
                ? 'bg-[var(--accent-green-bg)]'
                : 'bg-[var(--accent-red-bg)]'
            }`}
          >
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Result:</p>
            <pre className="text-xs text-[var(--foreground-secondary)] whitespace-pre-wrap">
              {toolResult.result.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// Empty state component
export function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-red)] flex items-center justify-center mb-6">
        <Bot size={40} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        Start a New Conversation
      </h2>
      <p className="text-[var(--foreground-secondary)] max-w-md mb-6">
        RxT-Beta processes conversations using event-driven architecture with persistent memory.
        Each interaction is processed independently while maintaining context through
        Mixture-of-Memory.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-[var(--foreground-muted)]">
        <span className="px-3 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)]">
          190M active params
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)]">
          Infinite context
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)]">
          Real-time processing
        </span>
      </div>
    </div>
  );
}
