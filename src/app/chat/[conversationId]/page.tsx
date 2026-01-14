'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { MainLayout } from '@/components/layout/main-layout';
import { ChatContainer } from '@/components/chat/chat-container';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { setActiveConversation, memoryStates, isAuthenticated } = useAppStore();

  const conversationId = params.conversationId as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Find and set the active conversation
    let found = false;
    for (const ms of memoryStates) {
      const conv = ms.conversations.find((c) => c.id === conversationId);
      if (conv) {
        setActiveConversation(conversationId);
        found = true;
        break;
      }
    }

    if (!found && memoryStates.length > 0) {
      // Conversation not found, redirect to chat
      router.push('/chat');
    }
  }, [conversationId, memoryStates, setActiveConversation, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <ChatContainer conversationId={conversationId} />
    </MainLayout>
  );
}
