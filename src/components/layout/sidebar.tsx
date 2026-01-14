'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Brain,
  Code,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  MemoryIcon,
  Bot,
  Zap,
} from '@/components/ui/icons';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/dropdown';

export function Sidebar() {
  const router = useRouter();
  const {
    memoryStates,
    activeMemoryStateId,
    activeConversationId,
    setActiveMemoryState,
    setActiveConversation,
    createMemoryState,
    createConversation,
    deleteMemoryState,
    deleteConversation,
    toggleMemoryStateExpanded,
    agents,
    activeAgentId,
    setActiveAgent,
    isSidebarOpen,
  } = useAppStore();

  const [isNewMemoryModalOpen, setIsNewMemoryModalOpen] = useState(false);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [newMemoryName, setNewMemoryName] = useState('');
  const [newMemoryDescription, setNewMemoryDescription] = useState('');
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [targetMemoryStateId, setTargetMemoryStateId] = useState<string | null>(null);
  const [isAgentsExpanded, setIsAgentsExpanded] = useState(true);

  const handleCreateMemoryState = () => {
    if (newMemoryName.trim()) {
      createMemoryState(newMemoryName.trim(), newMemoryDescription.trim() || undefined);
      setNewMemoryName('');
      setNewMemoryDescription('');
      setIsNewMemoryModalOpen(false);
    }
  };

  const handleCreateConversation = () => {
    if (newConversationTitle.trim() && targetMemoryStateId) {
      const conv = createConversation(targetMemoryStateId, newConversationTitle.trim());
      router.push(`/chat/${conv.id}`);
      setNewConversationTitle('');
      setTargetMemoryStateId(null);
      setIsNewConversationModalOpen(false);
    }
  };

  const openNewConversationModal = (memoryStateId: string) => {
    setTargetMemoryStateId(memoryStateId);
    setIsNewConversationModalOpen(true);
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'continual_learning':
        return <Brain size={16} className="text-[var(--accent-purple)]" />;
      case 'research':
        return <Search size={16} className="text-[var(--accent-blue)]" />;
      case 'code':
        return <Code size={16} className="text-[var(--accent-green)]" />;
      default:
        return <Bot size={16} className="text-[var(--foreground-muted)]" />;
    }
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <>
      <aside className="w-72 h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col">
        {/* New Chat button */}
        <div className="p-3 border-b border-[var(--border)]">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setIsNewMemoryModalOpen(true)}
          >
            <Plus size={16} />
            <span>New Memory State</span>
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Agents Section */}
          <div className="p-2">
            <button
              onClick={() => setIsAgentsExpanded(!isAgentsExpanded)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider hover:text-[var(--foreground)] transition-colors"
            >
              {isAgentsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Bot size={14} />
              <span>Agents</span>
            </button>

            {isAgentsExpanded && (
              <div className="mt-1 space-y-0.5">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(activeAgentId === agent.id ? null : agent.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left
                      transition-colors duration-150
                      ${
                        activeAgentId === agent.id
                          ? 'bg-[var(--sidebar-item-active)] text-[var(--foreground)]'
                          : 'text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--foreground)]'
                      }
                    `}
                  >
                    {getAgentIcon(agent.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{agent.name}</span>
                        {agent.type === 'continual_learning' && (
                          <Zap size={12} className="text-[var(--accent-yellow)] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] truncate">
                        {agent.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px mx-3 bg-[var(--border)]" />

          {/* Memory States Section */}
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex items-center gap-2">
                <MemoryIcon size={14} />
                Memory States
              </span>
            </div>

            {memoryStates.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-[var(--foreground-muted)]">No memory states yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsNewMemoryModalOpen(true)}
                >
                  Create your first memory state
                </Button>
              </div>
            ) : (
              <div className="mt-1 space-y-1">
                {memoryStates.map((memoryState) => (
                  <div key={memoryState.id}>
                    {/* Memory State Header */}
                    <div
                      className={`
                        flex items-center gap-1 px-2 py-1.5 rounded-lg
                        ${
                          activeMemoryStateId === memoryState.id
                            ? 'bg-[var(--sidebar-item-active)]'
                            : 'hover:bg-[var(--sidebar-item-hover)]'
                        }
                      `}
                    >
                      <button
                        onClick={() => toggleMemoryStateExpanded(memoryState.id)}
                        className="p-0.5 hover:bg-[var(--background-tertiary)] rounded"
                      >
                        {memoryState.isExpanded ? (
                          <ChevronDown size={14} className="text-[var(--foreground-muted)]" />
                        ) : (
                          <ChevronRight size={14} className="text-[var(--foreground-muted)]" />
                        )}
                      </button>

                      <button
                        onClick={() => setActiveMemoryState(memoryState.id)}
                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                      >
                        <MemoryIcon size={16} className="text-[var(--accent-green)] flex-shrink-0" />
                        <span className="text-sm font-medium text-[var(--foreground)] truncate">
                          {memoryState.name}
                        </span>
                        <span className="text-xs text-[var(--foreground-muted)] flex-shrink-0">
                          ({memoryState.conversations.length})
                        </span>
                      </button>

                      <Dropdown
                        trigger={
                          <button className="p-1 hover:bg-[var(--background-tertiary)] rounded opacity-0 group-hover:opacity-100">
                            <MoreVertical size={14} className="text-[var(--foreground-muted)]" />
                          </button>
                        }
                        align="right"
                      >
                        <DropdownItem
                          icon={<Plus size={14} />}
                          onClick={() => openNewConversationModal(memoryState.id)}
                        >
                          New Conversation
                        </DropdownItem>
                        <DropdownItem icon={<Edit3 size={14} />}>
                          Rename
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                          icon={<Trash2 size={14} />}
                          onClick={() => deleteMemoryState(memoryState.id)}
                          danger
                        >
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>

                    {/* Conversations list */}
                    {memoryState.isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {memoryState.conversations.length === 0 ? (
                          <button
                            onClick={() => openNewConversationModal(memoryState.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)] rounded-lg transition-colors"
                          >
                            <Plus size={14} />
                            <span>New conversation</span>
                          </button>
                        ) : (
                          <>
                            {memoryState.conversations.map((conversation) => (
                              <div
                                key={conversation.id}
                                className={`
                                  group flex items-center gap-2 px-3 py-2 rounded-lg
                                  transition-colors duration-150 cursor-pointer
                                  ${
                                    activeConversationId === conversation.id
                                      ? 'bg-[var(--sidebar-item-active)]'
                                      : 'hover:bg-[var(--sidebar-item-hover)]'
                                  }
                                `}
                                onClick={() => {
                                  setActiveConversation(conversation.id);
                                  router.push(`/chat/${conversation.id}`);
                                }}
                              >
                                <MessageSquare
                                  size={14}
                                  className={
                                    activeConversationId === conversation.id
                                      ? 'text-[var(--primary)]'
                                      : 'text-[var(--foreground-muted)]'
                                  }
                                />
                                <span className="flex-1 text-sm truncate text-[var(--foreground)]">
                                  {conversation.title}
                                </span>
                                <Dropdown
                                  trigger={
                                    <button
                                      className="p-1 hover:bg-[var(--background-tertiary)] rounded opacity-0 group-hover:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical
                                        size={12}
                                        className="text-[var(--foreground-muted)]"
                                      />
                                    </button>
                                  }
                                  align="right"
                                >
                                  <DropdownItem icon={<Edit3 size={14} />}>
                                    Rename
                                  </DropdownItem>
                                  <DropdownDivider />
                                  <DropdownItem
                                    icon={<Trash2 size={14} />}
                                    onClick={() => deleteConversation(conversation.id)}
                                    danger
                                  >
                                    Delete
                                  </DropdownItem>
                                </Dropdown>
                              </div>
                            ))}
                            <button
                              onClick={() => openNewConversationModal(memoryState.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)] rounded-lg transition-colors"
                            >
                              <Plus size={12} />
                              <span>Add conversation</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--foreground-muted)] text-center">
            <span className="gradient-text font-medium">RxT-Beta 3B</span>
            <span className="mx-1">|</span>
            <span>190M active params</span>
          </div>
        </div>
      </aside>

      {/* New Memory State Modal */}
      <Modal
        isOpen={isNewMemoryModalOpen}
        onClose={() => setIsNewMemoryModalOpen(false)}
        title="Create Memory State"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Memory states store context across multiple conversations. Each memory state maintains
            its own Mixture-of-Memory (MoM) that persists between interactions.
          </p>
          <Input
            label="Name"
            placeholder="e.g., Research Assistant"
            value={newMemoryName}
            onChange={(e) => setNewMemoryName(e.target.value)}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="e.g., Memory for AI research discussions"
            value={newMemoryDescription}
            onChange={(e) => setNewMemoryDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsNewMemoryModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateMemoryState}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Conversation Modal */}
      <Modal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        title="Start New Conversation"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            This conversation will share memory with other conversations in the same memory state.
          </p>
          <Input
            label="Title"
            placeholder="e.g., Understanding RxT Architecture"
            value={newConversationTitle}
            onChange={(e) => setNewConversationTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsNewConversationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateConversation}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
