'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { mockPlans } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {ReactiveAILogo, Check, ArrowRight, Zap, Sparkles, BetaLogo} from '@/components/ui/icons';

export default function PlansPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppStore();

  const handleSelectPlan = (planId: string) => {
    // In a real app, this would handle payment
    console.log('Selected plan:', planId);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4 gap-4">
            <ReactiveAILogo size={200} className="rounded-lg" />
            <BetaLogo size={200} className="rounded-lg" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            Experience the power of Reactive Language Models with persistent memory and
            infinite context. Select the plan that fits your needs.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative bg-[var(--card-bg)] border rounded-2xl p-6
                transition-all duration-300 hover:shadow-xl
                ${
                  plan.isPopular
                    ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10'
                    : 'border-[var(--border)]'
                }
              `}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-red)] text-white text-xs font-semibold flex items-center gap-1">
                    <Sparkles size={12} />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">{plan.name}</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-[var(--foreground)]">
                    ${plan.price}
                  </span>
                  <span className="text-[var(--foreground-muted)]">/{plan.priceUnit}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check
                      size={18}
                      className={
                        plan.isPopular
                          ? 'text-[var(--primary)] flex-shrink-0 mt-0.5'
                          : 'text-[var(--accent-green)] flex-shrink-0 mt-0.5'
                      }
                    />
                    <span className="text-sm text-[var(--foreground-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                variant={plan.isPopular ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
                rightIcon={<ArrowRight size={16} />}
              >
                {plan.price === 0 ? 'Get Started Free' : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ/Features section */}
        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-6 text-center">
            Why <span className="gradient-text">RxT-Beta</span>?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-green-bg)] flex items-center justify-center mx-auto mb-3">
                <Zap size={24} className="text-[var(--accent-green)]" />
              </div>
              <h4 className="font-semibold text-[var(--foreground)] mb-2">N Times Cheaper</h4>
              <p className="text-sm text-[var(--foreground-muted)]">
                RxLMs are N times cheaper than LLMs, where N is the number of messages in
                conversation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-purple-bg)] flex items-center justify-center mx-auto mb-3">
                <span className="text-[var(--accent-purple)] text-xl">∞</span>
              </div>
              <h4 className="font-semibold text-[var(--foreground)] mb-2">Infinite Context</h4>
              <p className="text-sm text-[var(--foreground-muted)]">
                No context window limitations. Memory expands infinitely with your
                conversations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-blue-bg)] flex items-center justify-center mx-auto mb-3">
                <span className="text-[var(--accent-blue)] text-xl">🧠</span>
              </div>
              <h4 className="font-semibold text-[var(--foreground)] mb-2">Persistent Memory</h4>
              <p className="text-sm text-[var(--foreground-muted)]">
                Memory persists across sessions with Mixture-of-Memory architecture
              </p>
            </div>
          </div>
        </div>

        {/* Skip/Continue link */}
        {isAuthenticated && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/chat')}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Skip for now and continue with {user?.plan || 'free'} plan →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
