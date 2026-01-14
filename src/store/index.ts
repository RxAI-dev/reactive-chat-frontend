import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  MemoryState,
  Conversation,
  Interaction,
  Agent,
  Settings,
  StreamingState,
} from '@/types';
import { mockMemoryStates, mockAgents } from '@/lib/mock-data';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;

  // Memory states (MoM)
  memoryStates: MemoryState[];
  activeMemoryStateId: string | null;
  setActiveMemoryState: (id: string) => void;
  createMemoryState: (name: string, description?: string) => MemoryState;
  updateMemoryState: (id: string, updates: Partial<MemoryState>) => void;
  deleteMemoryState: (id: string) => void;
  toggleMemoryStateExpanded: (id: string) => void;

  // Conversations
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  createConversation: (memoryStateId: string, title: string) => Conversation;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getActiveConversation: () => Conversation | null;

  // Interactions
  addInteraction: (conversationId: string, interaction: Interaction) => void;
  updateInteraction: (conversationId: string, interactionId: string, updates: Partial<Interaction>) => void;

  // Agents
  agents: Agent[];
  activeAgentId: string | null;
  setActiveAgent: (id: string | null) => void;

  // Streaming
  streaming: StreamingState;
  setStreaming: (state: Partial<StreamingState>) => void;

  // Settings
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;

  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Mock login
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockUser: User = {
          id: uuidv4(),
          email,
          name: email.split('@')[0],
          plan: 'pro',
          createdAt: new Date(),
        };
        set({
          user: mockUser,
          isAuthenticated: true,
          memoryStates: mockMemoryStates,
          agents: mockAgents,
          activeMemoryStateId: mockMemoryStates[0]?.id || null,
        });
        return true;
      },

      register: async (email: string, _password: string, name: string) => {
        // Mock register
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockUser: User = {
          id: uuidv4(),
          email,
          name,
          plan: 'free',
          createdAt: new Date(),
        };
        set({
          user: mockUser,
          isAuthenticated: true,
          memoryStates: [],
          agents: mockAgents,
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          memoryStates: [],
          activeMemoryStateId: null,
          activeConversationId: null,
        });
      },

      // Memory states
      memoryStates: [],
      activeMemoryStateId: null,

      setActiveMemoryState: (id: string) => {
        set({ activeMemoryStateId: id });
      },

      createMemoryState: (name: string, description?: string) => {
        const newMemoryState: MemoryState = {
          id: uuidv4(),
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
          conversations: [],
          isExpanded: true,
        };
        set((state) => ({
          memoryStates: [...state.memoryStates, newMemoryState],
          activeMemoryStateId: newMemoryState.id,
        }));
        return newMemoryState;
      },

      updateMemoryState: (id: string, updates: Partial<MemoryState>) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) =>
            ms.id === id ? { ...ms, ...updates, updatedAt: new Date() } : ms
          ),
        }));
      },

      deleteMemoryState: (id: string) => {
        set((state) => ({
          memoryStates: state.memoryStates.filter((ms) => ms.id !== id),
          activeMemoryStateId:
            state.activeMemoryStateId === id
              ? state.memoryStates.find((ms) => ms.id !== id)?.id || null
              : state.activeMemoryStateId,
        }));
      },

      toggleMemoryStateExpanded: (id: string) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) =>
            ms.id === id ? { ...ms, isExpanded: !ms.isExpanded } : ms
          ),
        }));
      },

      // Conversations
      activeConversationId: null,

      setActiveConversation: (id: string) => {
        const state = get();
        // Find which memory state contains this conversation
        const memoryState = state.memoryStates.find((ms) =>
          ms.conversations.some((c) => c.id === id)
        );
        set({
          activeConversationId: id,
          activeMemoryStateId: memoryState?.id || state.activeMemoryStateId,
        });
      },

      createConversation: (memoryStateId: string, title: string) => {
        const newConversation: Conversation = {
          id: uuidv4(),
          memoryStateId,
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
          interactions: [],
        };
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) =>
            ms.id === memoryStateId
              ? {
                  ...ms,
                  conversations: [...ms.conversations, newConversation],
                  updatedAt: new Date(),
                }
              : ms
          ),
          activeConversationId: newConversation.id,
          activeMemoryStateId: memoryStateId,
        }));
        return newConversation;
      },

      updateConversation: (id: string, updates: Partial<Conversation>) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) => ({
            ...ms,
            conversations: ms.conversations.map((c) =>
              c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
            ),
          })),
        }));
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) => ({
            ...ms,
            conversations: ms.conversations.filter((c) => c.id !== id),
          })),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      getActiveConversation: () => {
        const state = get();
        if (!state.activeConversationId) return null;
        for (const ms of state.memoryStates) {
          const conv = ms.conversations.find((c) => c.id === state.activeConversationId);
          if (conv) return conv;
        }
        return null;
      },

      // Interactions
      addInteraction: (conversationId: string, interaction: Interaction) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) => ({
            ...ms,
            conversations: ms.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    interactions: [...c.interactions, interaction],
                    updatedAt: new Date(),
                  }
                : c
            ),
          })),
        }));
      },

      updateInteraction: (
        conversationId: string,
        interactionId: string,
        updates: Partial<Interaction>
      ) => {
        set((state) => ({
          memoryStates: state.memoryStates.map((ms) => ({
            ...ms,
            conversations: ms.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    interactions: c.interactions.map((i) =>
                      i.id === interactionId ? { ...i, ...updates } : i
                    ),
                  }
                : c
            ),
          })),
        }));
      },

      // Agents
      agents: [],
      activeAgentId: null,

      setActiveAgent: (id: string | null) => {
        set({ activeAgentId: id });
      },

      // Streaming
      streaming: {
        isStreaming: false,
        currentInteractionId: null,
        streamingPhase: null,
      },

      setStreaming: (state: Partial<StreamingState>) => {
        set((prev) => ({
          streaming: { ...prev.streaming, ...state },
        }));
      },

      // Settings
      settings: {
        theme: 'dark',
        language: 'en',
        defaultReasoningMode: 'extended',
        streamingSpeed: 'normal',
        showThinkingProcess: true,
        notifications: true,
      },

      updateSettings: (updates: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Sidebar
      isSidebarOpen: true,

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
    }),
    {
      name: 'reactive-ai-storage',
      partialize: (state) => ({
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
