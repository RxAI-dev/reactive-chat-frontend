'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {ReactiveAILogo, Mail, User, AlertCircle, ArrowRight, BetaLogo} from '@/components/ui/icons';
import { Lock } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/chat');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(email, password, name);
      if (success) {
        // Redirect to plans page after registration
        router.push('/plans');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 gap-4">
            <ReactiveAILogo size={200} className="rounded-lg" />
            <BetaLogo size={200} className="rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Create your <span className="gradient-text">RxT-Beta</span> account
          </h1>
          <p className="mt-2 text-[var(--foreground-secondary)]">
            Join the future of event-driven AI
          </p>
        </div>

        {/* Register form */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--accent-red-bg)] text-[var(--accent-red)] text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={18} />}
              autoFocus
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
            />

            <div className="text-xs text-[var(--foreground-muted)]">
              By signing up, you agree to our{' '}
              <a href="#" className="text-[var(--primary)] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Continue to Plans
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--primary)] hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Infinite Context', icon: '∞' },
            { label: 'Real-time', icon: '⚡' },
            { label: 'Memory', icon: '🧠' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="p-3 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-center"
            >
              <div className="text-xl mb-1">{feature.icon}</div>
              <div className="text-xs text-[var(--foreground-muted)]">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
