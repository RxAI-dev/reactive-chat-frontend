'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  MemoryIcon,
  MessageSquare,
  ArrowRight,
} from '@/components/ui/icons';

export default function ProfilePage() {
  const router = useRouter();
  const { user, memoryStates } = useAppStore();

  if (!user) {
    return null;
  }

  const totalConversations = memoryStates.reduce(
    (acc, ms) => acc + ms.conversations.length,
    0
  );

  const totalInteractions = memoryStates.reduce(
    (acc, ms) =>
      acc + ms.conversations.reduce((cAcc, c) => cAcc + c.interactions.length, 0),
    0
  );

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-red)] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold backdrop-blur-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-80">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-green-bg)] flex items-center justify-center mx-auto mb-2">
                <MemoryIcon size={20} className="text-[var(--accent-green)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {memoryStates.length}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Memory States</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue-bg)] flex items-center justify-center mx-auto mb-2">
                <MessageSquare size={20} className="text-[var(--accent-blue)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {totalConversations}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Conversations</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple-bg)] flex items-center justify-center mx-auto mb-2">
                <span className="text-[var(--accent-purple)] text-xl">⚡</span>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {totalInteractions}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Interactions</p>
            </div>
          </div>

          {/* Account Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <User size={20} />
              Account Information
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
              <div className="p-4 flex items-center gap-3">
                <User size={18} className="text-[var(--foreground-muted)]" />
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground-muted)]">Name</p>
                  <p className="text-[var(--foreground)]">{user.name}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Mail size={18} className="text-[var(--foreground-muted)]" />
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground-muted)]">Email</p>
                  <p className="text-[var(--foreground)]">{user.email}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Calendar size={18} className="text-[var(--foreground-muted)]" />
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground-muted)]">Member Since</p>
                  <p className="text-[var(--foreground)]">
                    {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Subscription
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {user.plan === 'free'
                      ? 'Limited features'
                      : user.plan === 'pro'
                      ? 'Full access to all features'
                      : 'Enterprise-grade features'}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    user.plan === 'free'
                      ? 'bg-[var(--background-secondary)] text-[var(--foreground-muted)]'
                      : user.plan === 'pro'
                      ? 'bg-[var(--accent-green-bg)] text-[var(--accent-green)]'
                      : 'bg-[var(--accent-purple-bg)] text-[var(--accent-purple)]'
                  }`}
                >
                  Active
                </span>
              </div>
              {user.plan !== 'enterprise' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/plans')}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h2 className="text-lg font-semibold text-[var(--accent-red)] mb-4">
              Danger Zone
            </h2>
            <div className="bg-[var(--accent-red-bg)] border border-[var(--accent-red)]/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Delete Account</p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
