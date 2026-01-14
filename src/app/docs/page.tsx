'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import {
  BookOpen,
  ChevronRight,
  Zap,
  Database,
  Cpu,
  Brain,
  Layers,
  Terminal,
  MemoryIcon,
  ThinkingIcon,
  Bot,
} from '@/components/ui/icons';

const docSections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: BookOpen,
    content: `
# RxT-Beta 3B Model

RxT-Beta is the world's first real-scale stateful **Reactive Language Model (RxLM)** with infinite memory & context. Unlike traditional LLMs that reprocess entire conversation history, RxT processes only single interactions in real-time.

## Key Features

- **Infinite Context**: No context window limitations through Mixture-of-Memory (MoM)
- **Real-time Processing**: Near-zero latency event-driven architecture
- **Linear Cost Scaling**: N times cheaper than LLMs (N = conversation length)
- **Persistent Memory**: Context maintained across interactions
- **Hybrid Reasoning**: Fast answers or extended thinking on demand

## Model Specifications

- **Active Parameters**: 190M per token
- **Total Parameters**: ~2.93B
- **Vocabulary**: 65k tokens (English + Polish)
- **Max Interaction Length**: 8,192 tokens
- **Max Conversation Length**: Infinite
    `,
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: Cpu,
    content: `
# Reactive Transformer Architecture

RxT introduces a paradigm shift from stateless to stateful AI processing.

## Core Components

### Generator-Decoder
- 25 layers (21 stateful MoE + 3 stateless MoE + 1 dense)
- Gated Sparse Query Attention (SQA) with 8/16 query heads
- Sparse Mixture-of-Experts with 384 routed experts (10 active)

### Memory Encoder
- 21 layers with bidirectional attention
- Processes completed interactions for memory updates
- 97M parameters

### Memory Attention
- Grouped Self/Interlayer Memory Attention
- Updates memory asynchronously after response generation
- 22.2M parameters

## Event-Driven Processing

1. User sends query
2. Decoder generates response using memory cross-attention
3. Encoder processes completed interaction
4. Memory attention updates memory state asynchronously
5. Updated memory ready for next interaction
    `,
  },
  {
    id: 'memory',
    title: 'Memory System',
    icon: Database,
    content: `
# Mixture-of-Memory (MoM)

RxT's memory system provides infinite context through a three-tier architecture.

## Memory Tiers

### Working Memory (512 slots)
- Immediate context for current interaction
- Highest priority in attention
- Updated with each interaction

### Short-Term Memory (2,560 slots)
- Recent interaction context
- 10 fragments of 256 slots each
- Enables retrieval of recent details

### Long-Term Memory (16k+ slots)
- Compressed historical representations
- 64+ fragments, expandable
- Stores full conversation history

## Memory Updates

Memory updates happen **asynchronously** after response generation:

\`\`\`
Response Generated → Memory Update Started
(User can send next query immediately)
Memory Update Completed → Ready for next interaction
\`\`\`

This design ensures true real-time processing without waiting for memory operations.
    `,
  },
  {
    id: 'interaction-template',
    title: 'Interaction Template',
    icon: Terminal,
    content: `
# Interaction Template

RxT uses a simplified template compared to LLM chat templates, processing only single interactions.

## Special Tokens

| Token | Purpose |
|-------|---------|
| \`[Q]\` | Query block (user message) |
| \`[A]\` | Answer block (model response) |
| \`[T]\` | Thinking/reasoning block |
| \`[C]\` | Agentic tool call |
| \`[U]\` | Agentic tool use (result) |
| \`[I]\` | Internal instruction |

## Modes

### Fast Answer Mode
\`\`\`
[Q] User query [A] Model answer
\`\`\`

### Extended Thinking Mode
\`\`\`
[Q] User query [T] Model thinking [A] Model answer
\`\`\`

### With Tool Call
\`\`\`
[Q] User query [T] Thinking [A] Answer [C] Tool call JSON
[U] Tool results [A] Summary
\`\`\`

## Controlling Reasoning

- End query with \`[A]\` → Forces fast answer
- End query with \`[T]\` → Activates extended thinking
    `,
  },
  {
    id: 'reasoning',
    title: 'Hybrid Reasoning',
    icon: Brain,
    content: `
# Hybrid Reasoning

RxT-Beta supports two reasoning modes, controlled per-interaction.

## Fast Answer Mode

- Direct response without explicit reasoning
- Lower latency
- Suitable for simple queries
- Uses implicit reasoning through memory

\`\`\`
[Q] What is 2+2? [A]
→ 4
\`\`\`

## Extended Thinking Mode

- Shows explicit reasoning process
- Better for complex problems
- Thinking block visible to user (if enabled)
- Model adds \`[A]\` token when done thinking

\`\`\`
[Q] Explain the implications of RxT architecture [T]
→ Let me analyze the key aspects...
   1. Event-driven processing means...
   2. Memory implications include...
[A] Based on my analysis...
\`\`\`

## When to Use Each Mode

| Mode | Best For |
|------|----------|
| Fast | Simple questions, quick facts |
| Extended | Complex analysis, reasoning tasks |
    `,
  },
  {
    id: 'agents',
    title: 'Agentic Capabilities',
    icon: Bot,
    content: `
# Agentic Tools

RxT-Beta supports agentic tool calls within the interaction template.

## Tool Call Flow

1. Model generates response with tool call \`[C]\`
2. Tool is executed externally
3. Results returned via \`[U]\` token
4. Model processes results and provides summary

## Supported Tool Types

### Web Search
\`\`\`json
{
  "tool": "web_search",
  "query": "latest AI research",
  "max_results": 5
}
\`\`\`

### Code Execution
\`\`\`json
{
  "tool": "code_exec",
  "language": "python",
  "code": "print('Hello')"
}
\`\`\`

## Continual Learning Agent

The special **Continual Learning Agent** can:
- Autonomously learn from interactions
- Update memory system in agentic steps
- Improve responses over time

This leverages RxT's unique ability to learn continuously from environment interactions.
    `,
  },
  {
    id: 'comparison',
    title: 'RxT vs LLMs',
    icon: Layers,
    content: `
# RxT vs Traditional LLMs

## Processing Model

| Aspect | LLMs | RxT |
|--------|------|-----|
| Context | Full history reprocessed | Single interaction |
| Memory | In-context (limited) | External (unlimited) |
| Latency | Increases with length | Constant |
| Cost | O(n²) per message | O(1) per message |

## Cost Comparison

For a conversation with N messages:

**LLMs**: Cost scales quadratically
- Message 1: 1 unit
- Message 2: 2 units
- Message N: N units
- Total: N(N+1)/2 units

**RxT**: Cost stays constant
- Each message: 1 unit
- Total: N units

For N=10 messages: LLM costs 55 units vs RxT costs 10 units

## Quality Comparison

RxT-Beta (190M active params) achieves:
- ~94% of GPT-4 quality on standard benchmarks
- **Superior** performance on long multi-turn conversations
- No "lost in the middle" phenomenon
- No context window truncation issues
    `,
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const currentSection = docSections.find((s) => s.id === activeSection) || docSections[0];

  return (
    <MainLayout requireAuth={false}>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 border-r border-[var(--border)] bg-[var(--sidebar-bg)] overflow-y-auto hidden md:block">
          <div className="p-4">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--primary)]" />
              Documentation
            </h2>
            <ul className="space-y-1">
              {docSections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left
                        transition-colors duration-150
                        ${
                          activeSection === section.id
                            ? 'bg-[var(--sidebar-item-active)] text-[var(--foreground)]'
                            : 'text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--foreground)]'
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        className={
                          activeSection === section.id
                            ? 'text-[var(--primary)]'
                            : 'text-[var(--foreground-muted)]'
                        }
                      />
                      <span>{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight size={14} className="ml-auto text-[var(--primary)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Mobile section selector */}
        <div className="md:hidden border-b border-[var(--border)] p-2 bg-[var(--background)]">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-2 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--foreground)]"
          >
            {docSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <article className="max-w-3xl mx-auto p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              {currentSection.content.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-3xl font-bold text-[var(--foreground)] mt-8 mb-4 first:mt-0">
                      {line.slice(2)}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-xl font-semibold text-[var(--foreground)] mt-6 mb-3">
                      {line.slice(3)}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-medium text-[var(--foreground)] mt-4 mb-2">
                      {line.slice(4)}
                    </h3>
                  );
                }
                if (line.startsWith('- **')) {
                  const [bold, rest] = line.slice(3).split('**:');
                  return (
                    <li key={idx} className="text-[var(--foreground-secondary)] mb-1 ml-4">
                      <strong className="text-[var(--foreground)]">{bold}</strong>:{rest}
                    </li>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={idx} className="text-[var(--foreground-secondary)] mb-1 ml-4">
                      {line.slice(2)}
                    </li>
                  );
                }
                if (line.startsWith('| ')) {
                  // Simple table handling
                  const cells = line.split('|').filter(Boolean).map((c) => c.trim());
                  if (line.includes('---')) {
                    return null;
                  }
                  return (
                    <tr key={idx} className="border-b border-[var(--border)]">
                      {cells.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-2 text-sm text-[var(--foreground-secondary)]">
                          {cell.startsWith('**') ? (
                            <strong className="text-[var(--foreground)]">
                              {cell.replace(/\*\*/g, '')}
                            </strong>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                }
                if (line.startsWith('```')) {
                  return null; // Skip code block markers for now
                }
                if (line.trim() === '') {
                  return <br key={idx} />;
                }
                return (
                  <p key={idx} className="text-[var(--foreground-secondary)] mb-3">
                    {line.split('`').map((part, i) =>
                      i % 2 === 1 ? (
                        <code
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-[var(--background-tertiary)] text-[var(--primary)] text-sm"
                        >
                          {part}
                        </code>
                      ) : (
                        part.split('**').map((p, j) =>
                          j % 2 === 1 ? (
                            <strong key={`${i}-${j}`} className="text-[var(--foreground)]">
                              {p}
                            </strong>
                          ) : (
                            p
                          )
                        )
                      )
                    )}
                  </p>
                );
              })}
            </div>
          </article>
        </main>
      </div>
    </MainLayout>
  );
}
