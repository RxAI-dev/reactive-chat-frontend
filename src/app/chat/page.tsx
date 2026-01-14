'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { MainLayout } from '@/components/layout/main-layout';
import { EmptyChat } from '@/components/chat/message';
import { Button } from '@/components/ui/button';
import {Plus, MemoryIcon, Bot, Zap, Database, Clock, BetaLogo} from '@/components/ui/icons';

export default function ChatPage() {
  const router = useRouter();
  const { memoryStates, createMemoryState, createConversation, isAuthenticated } = useAppStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleStartConversation = () => {
    let targetMemoryStateId: string;

    if (memoryStates.length === 0) {
      // Create default memory state
      const newMemoryState = createMemoryState('Default Memory', 'Your first memory state');
      targetMemoryStateId = newMemoryState.id;
    } else {
      targetMemoryStateId = memoryStates[0].id;
    }

    const conv = createConversation(targetMemoryStateId, 'New Conversation');
    router.push(`/chat/${conv.id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Welcome content */}
        <div className="max-w-2xl text-center">
          {/* Logo animation */}
          <div className="rounded-full flex items-center justify-center mx-auto mb-8">
            <BetaLogo size={300} className="rounded-lg" />
          </div>

          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Welcome to <span className="gradient-text">RxT-Beta</span>
          </h1>

          <p className="text-lg text-[var(--foreground-secondary)] mb-8">
            Experience the future of conversational AI with event-driven processing,
            persistent memory, and infinite context.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-green-bg)] flex items-center justify-center mx-auto mb-2">
                <Zap size={20} className="text-[var(--accent-green)]" />
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">Real-time</p>
              <p className="text-xs text-[var(--foreground-muted)]">Near-zero latency</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple-bg)] flex items-center justify-center mx-auto mb-2">
                <span className="text-[var(--accent-purple)] text-xl">∞</span>
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">Infinite</p>
              <p className="text-xs text-[var(--foreground-muted)]">No context limits</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue-bg)] flex items-center justify-center mx-auto mb-2">
                <Database size={20} className="text-[var(--accent-blue)]" />
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">Memory</p>
              <p className="text-xs text-[var(--foreground-muted)]">Persistent MoM</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-yellow-bg)] flex items-center justify-center mx-auto mb-2">
                <Clock size={20} className="text-[var(--accent-yellow)]" />
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">N× Cheaper</p>
              <p className="text-xs text-[var(--foreground-muted)]">Linear cost</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartConversation}
              leftIcon={<Plus size={20} />}
            >
              Start New Conversation
            </Button>

            {memoryStates.length === 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  createMemoryState('Research Assistant', 'Memory for research tasks');
                }}
                leftIcon={<MemoryIcon size={20} />}
              >
                Create Memory State
              </Button>
            )}
          </div>

          {/* Quick stats */}
          {memoryStates.length > 0 && (
            <div className="mt-8 p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
              <p className="text-sm text-[var(--foreground-muted)]">
                You have{' '}
                <span className="text-[var(--foreground)] font-medium">
                  {memoryStates.length} memory state{memoryStates.length !== 1 ? 's' : ''}
                </span>{' '}
                with{' '}
                <span className="text-[var(--foreground)] font-medium">
                  {memoryStates.reduce((acc, ms) => acc + ms.conversations.length, 0)} conversation
                  {memoryStates.reduce((acc, ms) => acc + ms.conversations.length, 0) !== 1
                    ? 's'
                    : ''}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
