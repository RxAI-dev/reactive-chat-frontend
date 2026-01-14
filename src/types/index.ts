// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

// Memory types (Mixture-of-Memory)
export interface MemoryState {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  conversations: Conversation[];
  isExpanded?: boolean;
}

// Conversation types
export interface Conversation {
  id: string;
  memoryStateId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  interactions: Interaction[];
}

// Interaction types (RxT processes single interactions, not full chat history)
export interface Interaction {
  id: string;
  conversationId: string;
  query: QueryMessage;
  thinking?: ThinkingMessage;
  answer: AnswerMessage;
  toolCalls?: ToolCallMessage[];
  timestamp: Date;
}

// Message types based on Interaction Template
export interface BaseMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export interface QueryMessage extends BaseMessage {
  type: 'query';
  internalInstruction?: string; // [I] token content
}

export interface ThinkingMessage extends BaseMessage {
  type: 'thinking';
  isStreaming?: boolean;
}

export interface AnswerMessage extends BaseMessage {
  type: 'answer';
  isStreaming?: boolean;
}

export interface ToolCallMessage extends BaseMessage {
  type: 'tool_call';
  toolName: string;
  toolArgs: Record<string, unknown>;
  toolResult?: ToolResultMessage;
}

export interface ToolResultMessage extends BaseMessage {
  type: 'tool_result';
  success: boolean;
  data?: unknown;
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'continual_learning' | 'research' | 'code' | 'custom';
  isActive: boolean;
}

// Subscription plans
export interface Plan {
  id: string;
  name: string;
  price: number;
  priceUnit: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  maxConversations: number;
  maxMemoryStates: number;
  maxTokensPerInteraction: number;
}

// Settings types
export interface Settings {
  theme: 'dark' | 'light' | 'system';
  language: string;
  defaultReasoningMode: 'fast' | 'extended';
  streamingSpeed: 'slow' | 'normal' | 'fast';
  showThinkingProcess: boolean;
  notifications: boolean;
}

// Streaming state for mock
export interface StreamingState {
  isStreaming: boolean;
  currentInteractionId: string | null;
  streamingPhase: 'thinking' | 'answer' | 'tool_call' | 'tool_result' | null;
}
