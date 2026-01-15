'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  ReactiveAILogo,
  ArrowRight,
  Zap,
  Database,
  Clock,
  Sparkles, BetaLogo,
} from '@/components/ui/icons';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  // If authenticated, redirect to chat
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--foreground)]">Reactive Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/docs')}>
              Docs
            </Button>
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => router.push('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl text-center">
          {/* Logo */}
          <div className="inline-block mb-8">
            <div className="flex items-center justify-center gap-4">
              <ReactiveAILogo size={200} className="rounded-lg" />
              <BetaLogo size={200} className="rounded-lg" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            The home of <span className="gradient-text">Event-Driven AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
            From <span className="text-[var(--primary)]">Sparse Query Attention</span> to{' '}
            <span className="text-[var(--accent-red)]">Reactor AGI</span>, we&apos;re revolutionizing
            AI with event-driven architectures inspired by the human nervous system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/register')}
              rightIcon={<ArrowRight size={20} />}
            >
              Try RxT-Beta
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push('/docs')}>
              <Sparkles size={20} />
              Documentation
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-left">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-green-bg)] flex items-center justify-center mb-4">
                <Zap size={24} className="text-[var(--accent-green)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Real-time Processing
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Near-zero latency event-driven architecture processes single interactions instead of
                full history.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-left">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple-bg)] flex items-center justify-center mb-4">
                <Database size={24} className="text-[var(--accent-purple)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Persistent Memory
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Mixture-of-Memory (MoM) maintains context across interactions with infinite
                expansion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] text-left">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue-bg)] flex items-center justify-center mb-4">
                <Clock size={24} className="text-[var(--accent-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                N× Cost Reduction
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                RxLMs are N times cheaper than LLMs, where N is the number of messages in
                conversation.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--foreground-muted)]">
          <p>
            © 2026 Reactive AI. Building the future of{' '}
            <span className="gradient-text">Event-Driven AI</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
