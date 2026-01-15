'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {ReactiveAILogo, Mail, AlertCircle, BetaLogo} from '@/components/ui/icons';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/chat');
      } else {
        setError('Invalid email or password');
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
            Welcome to <span className="gradient-text">RxT-Beta</span>
          </h1>
          <p className="mt-2 text-[var(--foreground-secondary)]">
            Sign in to access your conversations and memory states
          </p>
        </div>

        {/* Login form */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--accent-red-bg)] text-[var(--accent-red)] text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--foreground-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-[var(--primary)] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--primary)] hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)] text-center">
            <strong className="text-[var(--foreground)]">Demo Mode:</strong> Enter any email and
            password to explore the interface
          </p>
        </div>
      </div>
    </div>
  );
}
