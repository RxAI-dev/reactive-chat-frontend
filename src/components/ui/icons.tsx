'use client';

import Image from 'next/image';
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

export const ReactiveAILogo = ({ className = '', size = 40 }: { className?: string; size?: number }) => (
    <Image
        src="/logo_rxai.png"
        alt="Reactive AI"
        width={size}
        height={size}
        className={`w-24 md:w-30 h-24 md:h-30 shadow-logo transition-all duration-300 ${className}`}
    />
);

export const BetaLogo = ({ className = '', size = 40 }: { className?: string; size?: number }) => (
    <Image
        src="/logo_rxt_beta.png"
        alt="Reactive AI"
        width={size}
        height={size}
        className={`w-24 md:w-30 h-24 md:h-30 shadow-logo transition-all duration-300 ${className}`}
    />
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
