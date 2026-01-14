'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/dropdown';
import {
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  BookOpen,
  ChevronDown,
  ReactiveAILogo,
} from '@/components/ui/icons';

export function Header() {
  const router = useRouter();
  const { user, logout, toggleSidebar, isSidebarOpen } = useAppStore();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors lg:hidden"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <ReactiveAILogo size={32} />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              RxT-Beta
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">3B Model</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors"
          aria-label="Toggle theme"
          title={`Current: ${theme} (${resolvedTheme})`}
        >
          {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => router.push('/docs')}>
            <BookOpen size={16} />
            <span>Docs</span>
          </Button>
        </nav>

        {/* User menu */}
        {user ? (
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--sidebar-item-hover)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-red)] flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-[var(--foreground)]">
                  {user.name}
                </span>
                <ChevronDown size={16} className="text-[var(--foreground-muted)]" />
              </button>
            }
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[var(--foreground)]">{user.name}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
              </span>
            </div>
            <DropdownDivider />
            <DropdownItem icon={<User size={16} />} onClick={() => router.push('/profile')}>
              Profile
            </DropdownItem>
            <DropdownItem icon={<Settings size={16} />} onClick={() => router.push('/settings')}>
              Settings
            </DropdownItem>
            <DropdownItem icon={<BookOpen size={16} />} onClick={() => router.push('/docs')}>
              Documentation
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={<LogOut size={16} />} onClick={handleLogout} danger>
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button variant="primary" size="sm" onClick={() => router.push('/login')}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
