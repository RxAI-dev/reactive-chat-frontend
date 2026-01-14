'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { Interaction } from '@/types';
import { InteractionDisplay, EmptyChat } from './message';
import { ChatInput } from './chat-input';
import { createMockResponse, simulateStreaming } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';
import { MemoryIcon, Check, Database } from '@/components/ui/icons';

interface ChatContainerProps {
  conversationId: string;
}

export function ChatContainer({ conversationId }: ChatContainerProps) {
  const {
    getActiveConversation,
    addInteraction,
    updateInteraction,
    streaming,
    setStreaming,
    settings,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [memoryStatus, setMemoryStatus] = useState<'idle' | 'updating' | 'updated'>('idle');
  const conversation = getActiveConversation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.interactions, scrollToBottom]);

  const handleSendMessage = async (message: string, useThinking: boolean) => {
    if (!conversation) return;

    const interactionId = uuidv4();
    const now = new Date();

    // Create the initial interaction with query
    const newInteraction: Interaction = {
      id: interactionId,
      conversationId: conversation.id,
      query: {
        id: uuidv4(),
        type: 'query',
        content: message,
        timestamp: now,
      },
      answer: {
        id: uuidv4(),
        type: 'answer',
        content: '',
        timestamp: now,
      },
      timestamp: now,
    };

    // Add thinking if enabled
    if (useThinking) {
      newInteraction.thinking = {
        id: uuidv4(),
        type: 'thinking',
        content: '',
        timestamp: now,
        isStreaming: true,
      };
    }

    // Add interaction to store
    addInteraction(conversation.id, newInteraction);
    setStreaming({
      isStreaming: true,
      currentInteractionId: interactionId,
      streamingPhase: useThinking ? 'thinking' : 'answer',
    });

    // Get mock response
    const mockResponse = createMockResponse(message, useThinking);

    // Simulate streaming
    try {
      // Stream thinking if enabled
      if (useThinking && mockResponse.thinking) {
        let thinkingContent = '';
        await simulateStreaming(
          mockResponse.thinking,
          (token) => {
            thinkingContent += token;
            updateInteraction(conversation.id, interactionId, {
              thinking: {
                ...newInteraction.thinking!,
                content: thinkingContent,
              },
            });
            scrollToBottom();
          },
          settings.streamingSpeed
        );

        // Finish thinking, start answer
        updateInteraction(conversation.id, interactionId, {
          thinking: {
            ...newInteraction.thinking!,
            content: thinkingContent,
            isStreaming: false,
          },
        });
        setStreaming({ streamingPhase: 'answer' });
      }

      // Stream answer
      let answerContent = '';
      await simulateStreaming(
        mockResponse.answer,
        (token) => {
          answerContent += token;
          updateInteraction(conversation.id, interactionId, {
            answer: {
              ...newInteraction.answer,
              content: answerContent,
            },
          });
          scrollToBottom();
        },
        settings.streamingSpeed
      );

      // Finish streaming
      updateInteraction(conversation.id, interactionId, {
        answer: {
          ...newInteraction.answer,
          content: answerContent,
          isStreaming: false,
        },
      });

      setStreaming({
        isStreaming: false,
        currentInteractionId: null,
        streamingPhase: null,
      });

      // Simulate memory update (async, after response)
      setMemoryStatus('updating');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMemoryStatus('updated');
      setTimeout(() => setMemoryStatus('idle'), 2000);
    } catch (error) {
      console.error('Streaming error:', error);
      setStreaming({
        isStreaming: false,
        currentInteractionId: null,
        streamingPhase: null,
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col">
        <EmptyChat />
        <ChatInput onSend={handleSendMessage} disabled />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat header with memory status */}
      <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              {conversation.title}
            </h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              {conversation.interactions.length} interaction
              {conversation.interactions.length !== 1 ? 's' : ''} in this conversation
            </p>
          </div>

          {/* Memory status indicator */}
          <div
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              transition-all duration-300
              ${
                memoryStatus === 'updating'
                  ? 'bg-[var(--accent-yellow-bg)] text-[var(--accent-yellow)]'
                  : memoryStatus === 'updated'
                  ? 'bg-[var(--accent-green-bg)] text-[var(--accent-green)]'
                  : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)]'
              }
            `}
          >
            {memoryStatus === 'updating' ? (
              <>
                <Database size={14} className="animate-pulse" />
                <span>Updating Memory...</span>
              </>
            ) : memoryStatus === 'updated' ? (
              <>
                <Check size={14} />
                <span>Memory Updated</span>
              </>
            ) : (
              <>
                <MemoryIcon size={14} />
                <span>Memory Ready</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {conversation.interactions.length === 0 ? (
            <EmptyChat />
          ) : (
            <>
              {conversation.interactions.map((interaction) => (
                <InteractionDisplay
                  key={interaction.id}
                  interaction={interaction}
                  isStreaming={
                    streaming.isStreaming &&
                    streaming.currentInteractionId === interaction.id
                  }
                  streamingPhase={
                    streaming.currentInteractionId === interaction.id
                      ? streaming.streamingPhase
                      : null
                  }
                />
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
