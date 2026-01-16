'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { Interaction, ToolResultData } from '@/types';
import { InteractionDisplay, EmptyChat } from './message';
import { ChatInput } from './chat-input';
import { createMockResponse, simulateStreaming, createMockToolResponse } from '@/lib/mock-data';
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

  const handleSendMessage = async (message: string, useThinking: boolean, selectedTools?: string[]) => {
    if (!conversation) return;

    // Check if we should use tools
    const shouldUseTool = selectedTools && selectedTools.length > 0;
    const toolToUse = shouldUseTool ? selectedTools[0] : null; // Use first selected tool for demo

    if (shouldUseTool && toolToUse) {
      // Handle tool interaction flow
      await handleToolInteraction(message, useThinking, toolToUse);
    } else {
      // Handle regular interaction flow
      await handleRegularInteraction(message, useThinking);
    }
  };

  // Handle regular query interaction (no tools)
  const handleRegularInteraction = async (message: string, useThinking: boolean) => {
    if (!conversation) return;

    const interactionId = uuidv4();
    const now = new Date();

    // Create the initial interaction with query
    const newInteraction: Interaction = {
      id: interactionId,
      conversationId: conversation.id,
      type: 'query',
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

  // Handle tool interaction flow (creates two interactions)
  const handleToolInteraction = async (message: string, useThinking: boolean, toolId: string) => {
    if (!conversation) return;

    // Get mock tool response
    const toolResponse = createMockToolResponse(toolId, message);
    const now = new Date();

    // === INTERACTION 1: Query with tool call ===
    const queryInteractionId = uuidv4();
    const toolCallId = uuidv4();

    const queryInteraction: Interaction = {
      id: queryInteractionId,
      conversationId: conversation.id,
      type: 'query',
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
    if (useThinking && toolResponse.thinking) {
      queryInteraction.thinking = {
        id: uuidv4(),
        type: 'thinking',
        content: '',
        timestamp: now,
        isStreaming: true,
      };
    }

    // Add query interaction to store
    addInteraction(conversation.id, queryInteraction);
    setStreaming({
      isStreaming: true,
      currentInteractionId: queryInteractionId,
      streamingPhase: useThinking ? 'thinking' : 'answer',
    });

    try {
      // Stream thinking if enabled
      if (useThinking && toolResponse.thinking) {
        let thinkingContent = '';
        await simulateStreaming(
          toolResponse.thinking,
          (token) => {
            thinkingContent += token;
            updateInteraction(conversation.id, queryInteractionId, {
              thinking: {
                ...queryInteraction.thinking!,
                content: thinkingContent,
              },
            });
            scrollToBottom();
          },
          settings.streamingSpeed
        );

        updateInteraction(conversation.id, queryInteractionId, {
          thinking: {
            ...queryInteraction.thinking!,
            content: thinkingContent,
            isStreaming: false,
          },
        });
        setStreaming({ streamingPhase: 'answer' });
      }

      // Stream answer (brief statement about using tool)
      let answerContent = '';
      await simulateStreaming(
        toolResponse.answer,
        (token) => {
          answerContent += token;
          updateInteraction(conversation.id, queryInteractionId, {
            answer: {
              ...queryInteraction.answer,
              content: answerContent,
            },
          });
          scrollToBottom();
        },
        settings.streamingSpeed
      );

      // Add tool call to this interaction
      setStreaming({ streamingPhase: 'tool_call' });
      updateInteraction(conversation.id, queryInteractionId, {
        answer: {
          ...queryInteraction.answer,
          content: answerContent,
          isStreaming: false,
        },
        toolCalls: [
          {
            id: toolCallId,
            type: 'tool_call',
            content: '',
            toolName: toolResponse.toolCall.toolName,
            toolArgs: toolResponse.toolCall.toolArgs,
            timestamp: new Date(),
          },
        ],
      });
      scrollToBottom();

      // Simulate memory update while waiting for tool result
      setMemoryStatus('updating');

      // Simulate tool execution delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Memory updated after first interaction
      setMemoryStatus('updated');
      setTimeout(() => setMemoryStatus('idle'), 1000);

      // === INTERACTION 2: Tool result with final answer ===
      const toolResultInteractionId = uuidv4();
      const toolResultNow = new Date();

      // Create tool result data
      const toolResultData: ToolResultData = {
        id: uuidv4(),
        toolName: toolResponse.toolCall.toolName,
        toolArgs: toolResponse.toolCall.toolArgs,
        result: {
          success: toolResponse.toolResult.success,
          content: toolResponse.toolResult.content,
          data: toolResponse.toolResult.data,
        },
      };

      const toolResultInteraction: Interaction = {
        id: toolResultInteractionId,
        conversationId: conversation.id,
        type: 'tool_result',
        toolUse: {
          id: uuidv4(),
          type: 'tool_use',
          content: '',
          timestamp: toolResultNow,
          toolResults: [toolResultData],
        },
        answer: {
          id: uuidv4(),
          type: 'answer',
          content: '',
          timestamp: toolResultNow,
        },
        timestamp: toolResultNow,
      };

      // Add tool result interaction
      addInteraction(conversation.id, toolResultInteraction);
      setStreaming({
        isStreaming: true,
        currentInteractionId: toolResultInteractionId,
        streamingPhase: 'tool_result',
      });
      scrollToBottom();

      // Brief pause to show tool results
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stream final answer based on tool results
      setStreaming({ streamingPhase: 'answer' });
      let finalAnswerContent = '';
      await simulateStreaming(
        toolResponse.finalAnswer,
        (token) => {
          finalAnswerContent += token;
          updateInteraction(conversation.id, toolResultInteractionId, {
            answer: {
              ...toolResultInteraction.answer,
              content: finalAnswerContent,
            },
          });
          scrollToBottom();
        },
        settings.streamingSpeed
      );

      // Finish streaming
      updateInteraction(conversation.id, toolResultInteractionId, {
        answer: {
          ...toolResultInteraction.answer,
          content: finalAnswerContent,
          isStreaming: false,
        },
      });

      setStreaming({
        isStreaming: false,
        currentInteractionId: null,
        streamingPhase: null,
      });

      // Simulate memory update after tool result interaction
      setMemoryStatus('updating');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMemoryStatus('updated');
      setTimeout(() => setMemoryStatus('idle'), 2000);

    } catch (error) {
      console.error('Tool streaming error:', error);
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
