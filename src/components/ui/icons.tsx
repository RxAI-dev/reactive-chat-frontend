'use client';

import {
  MessageSquare,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Send,
  Brain,
  Code,
  BookOpen,
  Menu,
  X,
  MoreVertical,
  Trash2,
  Edit3,
  Copy,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Zap,
  Database,
  Clock,
  Infinity,
  ArrowRight,
  ExternalLink,
  Globe,
  Bot,
  Cpu,
  Layers,
  RefreshCw,
  Terminal,
  FileText,
  Bell,
  Monitor,
  Mail,
  Calendar,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

// Re-export icons we use
export {
  MessageSquare,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Send,
  Brain,
  Code,
  BookOpen,
  Menu,
  X,
  MoreVertical,
  Trash2,
  Edit3,
  Copy,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Zap,
  Database,
  Clock,
  Infinity,
  ArrowRight,
  ExternalLink,
  Globe,
  Bot,
  Cpu,
  Layers,
  RefreshCw,
  Terminal,
  FileText,
  Bell,
  Monitor,
  Mail,
  Calendar,
  CreditCard,
};

export type { LucideIcon };

// Custom Reactive AI logo as SVG component
export const ReactiveAILogo = ({ className = '', size = 40 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Infinity symbol with gradient */}
    <defs>
      <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <path
      d="M25 50C25 38.954 33.954 30 45 30C52.5 30 58.5 34 62 40C65.5 34 71.5 30 79 30C90.046 30 99 38.954 99 50C99 61.046 90.046 70 79 70C71.5 70 65.5 66 62 60C58.5 66 52.5 70 45 70C33.954 70 25 61.046 25 50Z"
      stroke="url(#infinityGradient)"
      strokeWidth="4"
      fill="none"
    />
    {/* Grid pattern on the loops */}
    <ellipse cx="37" cy="50" rx="10" ry="15" stroke="#ffffff40" strokeWidth="1" fill="none" />
    <ellipse cx="87" cy="50" rx="10" ry="15" stroke="#ffffff40" strokeWidth="1" fill="none" />
  </svg>
);

// Memory icon for MoM visualization
export const MemoryIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 3C8.5 3 5.5 4.5 5.5 6.5V17.5C5.5 19.5 8.5 21 12 21C15.5 21 18.5 19.5 18.5 17.5V6.5C18.5 4.5 15.5 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <ellipse cx="12" cy="6.5" rx="6.5" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M5.5 11C5.5 11 8.5 13 12 13C15.5 13 18.5 11 18.5 11" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 15C5.5 15 8.5 17 12 17C15.5 17 18.5 15 18.5 15" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Thinking/reasoning icon
export const ThinkingIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M9 9C9 7.5 10.5 6.5 12 6.5C13.5 6.5 15 7.5 15 9C15 10.5 13.5 11 12 11.5V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

// Event-driven icon
export const EventDrivenIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 18H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 10L20 12L17 14" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="6" r="2" fill="var(--accent-green)" />
  </svg>
);
