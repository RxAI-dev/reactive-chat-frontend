import { v4 as uuidv4 } from 'uuid';
import {
  MemoryState,
  Conversation,
  Interaction,
  Agent,
  Plan,
  Tool,
  QueryMessage,
  ThinkingMessage,
  AnswerMessage,
  ToolCallMessage,
  ToolResultMessage,
  ToolUseMessage,
  ToolResultData,
} from '@/types';

// Mock available tools
export const mockTools: Tool[] = [
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for current information and latest data',
    icon: 'search',
    isEnabled: true,
  },
  {
    id: 'code_interpreter',
    name: 'Code Interpreter',
    description: 'Execute Python code for calculations and data analysis',
    icon: 'code',
    isEnabled: true,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    icon: 'calculator',
    isEnabled: false,
  },
  {
    id: 'file_reader',
    name: 'File Reader',
    description: 'Read and analyze uploaded files',
    icon: 'file',
    isEnabled: false,
  },
  {
    id: 'image_analyzer',
    name: 'Image Analyzer',
    description: 'Analyze and describe images',
    icon: 'image',
    isEnabled: false,
  },
];

// Helper to create timestamps
const createDate = (daysAgo: number = 0, hoursAgo: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date;
};

// Mock interactions demonstrating different modes including proper tool flow
const createMockInteractions = (): Interaction[] => {
  const interactionId1 = uuidv4();
  const interactionId2 = uuidv4();
  const interactionId3 = uuidv4();
  const interactionId4 = uuidv4(); // Tool result interaction

  return [
    // Simple fast answer interaction (type: 'query')
    {
      id: interactionId1,
      conversationId: '',
      type: 'query',
      query: {
        id: uuidv4(),
        type: 'query',
        content: 'What is Reactive Transformer architecture?',
        timestamp: createDate(0, 2),
      },
      answer: {
        id: uuidv4(),
        type: 'answer',
        content: `Reactive Transformer (RxT) is a revolutionary stateful architecture that processes conversations in an event-driven manner. Unlike traditional LLMs that reprocess the entire conversation history for each response, RxT:

1. **Processes single interactions** - Only the current query and answer are processed, not the full chat history
2. **Uses persistent memory** - Context from previous interactions is stored in a dedicated embedding-based memory system (Mixture-of-Memory)
3. **Updates memory asynchronously** - After generating a response, memory is updated in the background
4. **Achieves infinite context** - No context window limitations since memory is external and expandable

This makes RxT models N times cheaper than LLMs for conversations, where N is the number of messages in the conversation.`,
        timestamp: createDate(0, 2),
      },
      timestamp: createDate(0, 2),
    },

    // Extended thinking interaction (type: 'query')
    {
      id: interactionId2,
      conversationId: '',
      type: 'query',
      query: {
        id: uuidv4(),
        type: 'query',
        content: 'Can you explain how the memory system works in detail?',
        timestamp: createDate(0, 1),
      },
      thinking: {
        id: uuidv4(),
        type: 'thinking',
        content: `Let me break down the Mixture-of-Memory (MoM) architecture...

The user is asking about the technical details of RxT's memory system. I should explain:
1. The different memory components (working, short-term, long-term)
2. How memory cross-attention works
3. The async update process
4. How this enables infinite context

I'll structure this as a comprehensive explanation since they asked for detail.`,
        timestamp: createDate(0, 1),
      },
      answer: {
        id: uuidv4(),
        type: 'answer',
        content: `The RxT memory system uses a **Dynamic Mixture-of-Memory (MoM)** architecture with three tiers:

### Working Memory (512 slots)
- Immediate context for the current interaction
- Highest priority in attention mechanisms
- Updated with each interaction

### Short-Term Memory (2,560 slots)
- Stores recent interaction context
- Organized in 10 fragments of 256 slots each
- Enables retrieval of recent conversation details

### Long-Term Memory (16k+ slots, extendable)
- Stores compressed representations of older interactions
- Organized in 64+ fragments
- Can grow infinitely to store conversation history

**How it works:**
1. When you send a query, the decoder accesses memory via **memory cross-attention**
2. The response is generated considering both current input and memory state
3. After response generation, the **encoder** processes the full interaction
4. The **memory attention** network asynchronously updates the memory state
5. This updated memory is ready for the next interaction

The key innovation is that memory updates happen asynchronously - the model doesn't wait for memory to update before responding, making it truly real-time.`,
        timestamp: createDate(0, 1),
      },
      timestamp: createDate(0, 1),
    },

    // Query interaction with tool call (type: 'query') - this ends with tool call
    // Memory is updated while waiting for tool results
    {
      id: interactionId3,
      conversationId: '',
      type: 'query',
      query: {
        id: uuidv4(),
        type: 'query',
        content: 'Search for the latest benchmarks comparing RxT to GPT-4',
        timestamp: createDate(0, 0.5),
      },
      thinking: {
        id: uuidv4(),
        type: 'thinking',
        content: `The user wants to find benchmark comparisons. I should use the web_search tool to find this information.

I'll search for recent benchmark results and comparisons between Reactive Transformer models and GPT-4.`,
        timestamp: createDate(0, 0.5),
      },
      answer: {
        id: uuidv4(),
        type: 'answer',
        content: `I'll search for the latest benchmark comparisons for you.`,
        timestamp: createDate(0, 0.5),
      },
      toolCalls: [
        {
          id: uuidv4(),
          type: 'tool_call',
          content: '',
          toolName: 'web_search',
          toolArgs: {
            query: 'Reactive Transformer RxT vs GPT-4 benchmarks 2026',
            max_results: 5,
          },
          timestamp: createDate(0, 0.5),
        },
      ],
      timestamp: createDate(0, 0.5),
    },

    // Tool result interaction (type: 'tool_result') - starts with tool results
    // This is a new separate interaction initiated by the tool results
    {
      id: interactionId4,
      conversationId: '',
      type: 'tool_result',
      toolUse: {
        id: uuidv4(),
        type: 'tool_use',
        content: '',
        timestamp: createDate(0, 0.4),
        toolResults: [
          {
            id: uuidv4(),
            toolName: 'web_search',
            toolArgs: {
              query: 'Reactive Transformer RxT vs GPT-4 benchmarks 2026',
              max_results: 5,
            },
            result: {
              success: true,
              content: `Found 3 relevant results:
1. "RxT-Beta achieves 50% higher accuracy than same-size stateless LLM in multi-turn conversations" - Reactive AI Blog
2. "Benchmark: Stateful vs Stateless LLMs in Multi-turn Conversations" - arXiv paper
3. "RxT models show N-times cost reduction for long conversations" - Tech Review`,
              data: {
                results: [
                  { title: 'RxT-Beta Performance', url: '#', snippet: '50% higher accuracy...' },
                  { title: 'Benchmark Study', url: '#', snippet: 'Stateful vs Stateless comparison...' },
                  { title: 'Cost Analysis', url: '#', snippet: 'N-times cost reduction...' },
                ],
              },
            },
          },
        ],
      },
      answer: {
        id: uuidv4(),
        type: 'answer',
        content: `Based on the search results, here are the latest benchmark findings comparing RxT to traditional models:

### Key Findings:

**1. Multi-turn Conversation Accuracy**
RxT-Beta achieves **50% higher accuracy** than same-size stateless LLMs in multi-turn conversations. This is attributed to the persistent memory system that maintains context without reprocessing.

**2. Stateful vs Stateless Comparison**
Research shows that stateful architectures like RxT significantly outperform stateless alternatives when conversations exceed 8+ turns, where traditional LLMs start showing degradation.

**3. Cost Efficiency**
RxT models demonstrate **N-times cost reduction** for long conversations, where N equals the number of messages. For a 20-message conversation, this means approximately 10x lower computational cost compared to GPT-4.

### Summary
While direct head-to-head comparisons are still emerging, early benchmarks strongly favor RxT for:
- Extended multi-turn dialogues
- Cost-sensitive deployments
- Real-time applications requiring consistent latency`,
        timestamp: createDate(0, 0.4),
      },
      timestamp: createDate(0, 0.4),
    },
  ];
};

// Create mock conversations
const createMockConversation = (
  id: string,
  memoryStateId: string,
  title: string,
  daysAgo: number
): Conversation => {
  const interactions = title.includes('RxT') ? createMockInteractions() : [];
  return {
    id,
    memoryStateId,
    title,
    createdAt: createDate(daysAgo),
    updatedAt: createDate(daysAgo > 0 ? daysAgo - 0.5 : 0),
    interactions: interactions.map((i) => ({ ...i, conversationId: id })),
  };
};

// Mock memory states
export const mockMemoryStates: MemoryState[] = [
  {
    id: 'mem-1',
    name: 'Research Assistant',
    description: 'Memory state for AI research discussions',
    createdAt: createDate(30),
    updatedAt: createDate(0),
    isExpanded: true,
    conversations: [
      createMockConversation('conv-1', 'mem-1', 'Understanding RxT Architecture', 0),
      createMockConversation('conv-2', 'mem-1', 'Sparse Query Attention Deep Dive', 2),
      createMockConversation('conv-3', 'mem-1', 'Training Methodology Questions', 5),
    ],
  },
  {
    id: 'mem-2',
    name: 'Code Assistant',
    description: 'Memory state for coding help',
    createdAt: createDate(20),
    updatedAt: createDate(1),
    isExpanded: false,
    conversations: [
      createMockConversation('conv-4', 'mem-2', 'Python Best Practices', 1),
      createMockConversation('conv-5', 'mem-2', 'TypeScript Type System', 3),
    ],
  },
  {
    id: 'mem-3',
    name: 'Learning Session',
    description: 'Memory state with continual learning enabled',
    createdAt: createDate(10),
    updatedAt: createDate(0),
    isExpanded: false,
    conversations: [
      createMockConversation('conv-6', 'mem-3', 'Machine Learning Fundamentals', 0),
    ],
  },
];

// Mock agents
export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Continual Learning Agent',
    description: 'Autonomously learns and updates memory system in real-time',
    icon: 'brain',
    type: 'continual_learning',
    isActive: true,
  },
  {
    id: 'agent-2',
    name: 'Research Agent',
    description: 'Searches and synthesizes information from multiple sources',
    icon: 'search',
    type: 'research',
    isActive: true,
  },
  {
    id: 'agent-3',
    name: 'Code Agent',
    description: 'Assists with coding tasks, debugging, and code review',
    icon: 'code',
    type: 'code',
    isActive: true,
  },
];

// Mock subscription plans
export const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceUnit: 'month',
    features: [
      '100 interactions per day',
      '2 memory states',
      '5 conversations per memory state',
      'Basic reasoning mode',
      'Community support',
    ],
    maxConversations: 10,
    maxMemoryStates: 2,
    maxTokensPerInteraction: 4096,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    priceUnit: 'month',
    features: [
      'Unlimited interactions',
      '10 memory states',
      'Unlimited conversations',
      'Extended thinking mode',
      'Priority support',
      'API access',
      'Advanced agents',
    ],
    isPopular: true,
    maxConversations: -1,
    maxMemoryStates: 10,
    maxTokensPerInteraction: 8192,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    priceUnit: 'month',
    features: [
      'Everything in Pro',
      'Unlimited memory states',
      'Custom model fine-tuning',
      'Dedicated support',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced analytics',
    ],
    maxConversations: -1,
    maxMemoryStates: -1,
    maxTokensPerInteraction: 8192,
  },
];

// Mock streaming responses
export const mockStreamingResponses = {
  simple: {
    answer: `This is a simple response from RxT-Beta. The model processes your query in real-time using its event-driven architecture.

Key points:
- Processing only this single interaction
- Memory from previous interactions is accessed via cross-attention
- Response is generated with near-zero latency
- Memory will be updated asynchronously after this response`,
  },
  withThinking: {
    thinking: `Analyzing the user's question...

Let me consider the key aspects:
1. The question relates to the model's capabilities
2. I should explain the unique RxT features
3. I'll provide concrete examples

Now formulating a comprehensive response...`,
    answer: `Based on my analysis, here's a detailed explanation:

**Reactive Language Models (RxLMs)** represent a paradigm shift in AI architecture. Unlike traditional LLMs that are stateless and must reprocess entire conversations, RxLMs:

1. **Maintain persistent state** through the Mixture-of-Memory system
2. **Process events** (single interactions) rather than batch data
3. **Learn continuously** from each interaction

This makes them particularly suited for:
- Long-running conversations
- Personalized assistants
- Real-time applications
- Cost-sensitive deployments

The RxT-Beta 3B model demonstrates these capabilities with only 190M active parameters per token.`,
  },
  withToolCall: {
    thinking: `The user's request requires external information. I'll use the appropriate tool to gather this data.`,
    answer: `I'll help you with that by using my available tools.`,
    toolCall: {
      name: 'web_search',
      args: { query: 'example search query' },
    },
    toolResult: `Search completed successfully. Found relevant results.`,
    finalAnswer: `Based on the search results, here's what I found...`,
  },
};

// Streaming simulation helper
export const simulateStreaming = async (
  text: string,
  onToken: (token: string) => void,
  speed: 'slow' | 'normal' | 'fast' = 'normal'
): Promise<void> => {
  const delays = { slow: 50, normal: 25, fast: 10 };
  const delay = delays[speed];

  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    onToken(words[i] + (i < words.length - 1 ? ' ' : ''));
  }
};

// Create new mock interaction
export const createMockResponse = (
  query: string,
  useThinking: boolean = true
): { thinking?: string; answer: string } => {
  if (useThinking) {
    return {
      thinking: `Processing your query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"

Let me analyze this request and formulate an appropriate response based on my current memory state and knowledge.

Considering the context from our conversation history...`,
      answer: `Thank you for your question about "${query.substring(0, 30)}${query.length > 30 ? '...' : ''}".

This is a mock response from RxT-Beta demonstrating the event-driven processing model. In a real deployment:

1. Your query would be processed in real-time
2. The model would access relevant memory via cross-attention
3. A response would be generated with hybrid reasoning
4. Memory would be updated asynchronously

The unique advantage of RxT architecture is that this interaction will be encoded into memory, making future responses in this conversation more contextually aware - without reprocessing the entire history.`,
    };
  }

  return {
    answer: `Here's a quick response to your query.

RxT-Beta processes this as a single interaction, accessing memory from previous exchanges via the Mixture-of-Memory system. This event-driven approach enables real-time responses with infinite context.`,
  };
};

// Tool-specific mock responses
export const toolMockResponses: Record<string, {
  thinking?: string;
  answer: string;
  toolArgs: Record<string, unknown>;
  toolResult: { success: boolean; content: string; data?: unknown };
  finalAnswer: string;
}> = {
  web_search: {
    thinking: `The user's query requires current information that I should retrieve using web search.

I'll use the web_search tool to find the most relevant and up-to-date information.`,
    answer: `I'll search the web to find the most current information for you.`,
    toolArgs: {
      query: 'search query based on user input',
      max_results: 5,
    },
    toolResult: {
      success: true,
      content: `Found 4 relevant results:
1. "Latest AI Research Findings" - Tech News
2. "Comprehensive Analysis Report" - Research Institute
3. "Expert Opinions on Current Trends" - Industry Blog
4. "Recent Developments Overview" - Academic Journal`,
      data: {
        results: [
          { title: 'Latest AI Research', url: '#', snippet: 'New findings...' },
          { title: 'Analysis Report', url: '#', snippet: 'Detailed analysis...' },
          { title: 'Expert Opinions', url: '#', snippet: 'Industry experts...' },
          { title: 'Recent Developments', url: '#', snippet: 'Overview of...' },
        ],
      },
    },
    finalAnswer: `Based on the search results, here's what I found:

### Summary of Findings

The search returned several relevant sources that provide comprehensive information on the topic.

**Key Points:**
- Latest research indicates significant progress in the field
- Industry experts have noted important developments
- Academic sources provide detailed analysis

The information has been gathered from multiple reliable sources to give you a well-rounded perspective.`,
  },
  code_interpreter: {
    thinking: `The user's request involves code execution or data analysis.

I'll use the code interpreter to run the necessary calculations and provide accurate results.`,
    answer: `Let me run the code to analyze this for you.`,
    toolArgs: {
      code: 'python code to execute',
      language: 'python',
    },
    toolResult: {
      success: true,
      content: `Execution completed successfully.

Output:
- Calculation result: 42
- Data processed: 100 rows
- Analysis complete`,
      data: {
        stdout: 'Calculation result: 42',
        execution_time: '0.023s',
      },
    },
    finalAnswer: `The code execution completed successfully. Here are the results:

### Execution Results

**Output:**
- Calculation result: 42
- Processed 100 rows of data
- Analysis completed in 0.023 seconds

The computation ran without errors and produced the expected output.`,
  },
  calculator: {
    thinking: `This requires a mathematical calculation that I'll perform using the calculator tool.`,
    answer: `Let me calculate that for you.`,
    toolArgs: {
      expression: 'mathematical expression',
    },
    toolResult: {
      success: true,
      content: 'Result: 3.14159',
    },
    finalAnswer: `The calculation is complete.

**Result: 3.14159**

This value was computed with high precision using the calculator tool.`,
  },
  file_reader: {
    thinking: `The user wants to analyze a file. I'll use the file reader to extract and process the content.`,
    answer: `I'll read and analyze the file for you.`,
    toolArgs: {
      file_path: 'path/to/file',
      encoding: 'utf-8',
    },
    toolResult: {
      success: true,
      content: `File read successfully.
Content preview:
- File size: 2.4 KB
- Lines: 150
- Type: Text/CSV`,
      data: {
        preview: 'First 100 characters of file...',
        metadata: { size: 2400, lines: 150 },
      },
    },
    finalAnswer: `I've successfully read the file. Here's the analysis:

### File Overview

**Metadata:**
- Size: 2.4 KB
- Lines: 150
- Format: Text/CSV

The file has been processed and is ready for further analysis.`,
  },
  image_analyzer: {
    thinking: `The user wants to analyze an image. I'll use the image analyzer to identify and describe its contents.`,
    answer: `Let me analyze the image for you.`,
    toolArgs: {
      image_url: 'url/to/image',
      analysis_type: 'comprehensive',
    },
    toolResult: {
      success: true,
      content: `Image analysis complete.

Detected:
- Objects: 5 identified
- Scene: Indoor office environment
- Colors: Predominantly blue and white
- Text: Some visible text elements`,
      data: {
        objects: ['desk', 'computer', 'chair', 'lamp', 'books'],
        confidence: 0.94,
      },
    },
    finalAnswer: `Image analysis complete. Here's what I found:

### Analysis Results

**Scene:** Indoor office environment

**Detected Objects:**
- Desk
- Computer
- Chair
- Lamp
- Books

**Color Palette:** Predominantly blue and white

**Confidence:** 94%

The image appears to be a well-lit office workspace.`,
  },
};

// Create mock tool interaction responses
export const createMockToolResponse = (
  toolId: string,
  query: string
): {
  thinking?: string;
  answer: string;
  toolCall: {
    toolName: string;
    toolArgs: Record<string, unknown>;
  };
  toolResult: {
    success: boolean;
    content: string;
    data?: unknown;
  };
  finalAnswer: string;
} => {
  const toolResponse = toolMockResponses[toolId] || toolMockResponses['web_search'];

  // Customize args based on query
  const customArgs = { ...toolResponse.toolArgs };
  if (toolId === 'web_search') {
    customArgs.query = query.substring(0, 100);
  } else if (toolId === 'code_interpreter') {
    customArgs.code = `# Analyzing: ${query.substring(0, 50)}`;
  }

  return {
    thinking: toolResponse.thinking,
    answer: toolResponse.answer,
    toolCall: {
      toolName: toolId,
      toolArgs: customArgs,
    },
    toolResult: toolResponse.toolResult,
    finalAnswer: toolResponse.finalAnswer,
  };
};
