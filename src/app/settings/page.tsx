'use client';

import { useAppStore } from '@/store';
import { MainLayout } from '@/components/layout/main-layout';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import {Moon, Sun, Monitor, Zap, ThinkingIcon, Bell, Globe, Brain} from '@/components/ui/icons';

export default function SettingsPage() {
  const { settings, updateSettings, user } = useAppStore();
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'system' as const, label: 'System', icon: Monitor },
  ];

  const speeds = [
    { id: 'slow' as const, label: 'Slow', description: 'Deliberate streaming' },
    { id: 'normal' as const, label: 'Normal', description: 'Balanced speed' },
    { id: 'fast' as const, label: 'Fast', description: 'Quick streaming' },
  ];

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Settings</h1>

          {/* Theme Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Sun size={20} />
              Appearance
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
                      ${
                        theme === id
                          ? 'border-[var(--primary)] bg-[var(--accent-green-bg)]'
                          : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--sidebar-item-hover)]'
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={theme === id ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}
                    />
                    <span
                      className={`text-sm ${
                        theme === id ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Reasoning Mode Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <ThinkingIcon size={20} />
              Default Reasoning Mode
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => updateSettings({ defaultReasoningMode: 'auto' })}
                    className={`
                    flex items-center gap-3 p-4 rounded-lg border transition-all
                    ${
                        settings.defaultReasoningMode === 'auto'
                            ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-bg)]'
                            : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }
                  `}
                >
                  <ThinkingIcon
                      size={24}
                      className={
                        settings.defaultReasoningMode === 'auto'
                            ? 'text-[var(--accent-blue)]'
                            : 'text-[var(--foreground-muted)]'
                      }
                  />
                  <div className="text-left">
                    <p className="font-medium text-[var(--foreground)]">Auto</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Automatic selection</p>
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ defaultReasoningMode: 'fast' })}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border transition-all
                    ${
                      settings.defaultReasoningMode === 'fast'
                        ? 'border-[var(--accent-green)] bg-[var(--accent-green-bg)]'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }
                  `}
                >
                  <Zap
                    size={24}
                    className={
                      settings.defaultReasoningMode === 'fast'
                        ? 'text-[var(--accent-green)]'
                        : 'text-[var(--foreground-muted)]'
                    }
                  />
                  <div className="text-left">
                    <p className="font-medium text-[var(--foreground)]">Fast Answer</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Direct responses</p>
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ defaultReasoningMode: 'extended' })}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border transition-all
                    ${
                      settings.defaultReasoningMode === 'extended'
                        ? 'border-[var(--accent-purple)] bg-[var(--accent-purple-bg)]'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }
                  `}
                >
                  <Brain
                    size={24}
                    className={
                      settings.defaultReasoningMode === 'extended'
                        ? 'text-[var(--accent-purple)]'
                        : 'text-[var(--foreground-muted)]'
                    }
                  />
                  <div className="text-left">
                    <p className="text-[0.85rem] font-medium text-[var(--foreground)]">Extended Thinking</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Show reasoning</p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* Streaming Speed Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Zap size={20} />
              Streaming Speed
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <div className="grid grid-cols-3 gap-2">
                {speeds.map(({ id, label, description }) => (
                  <button
                    key={id}
                    onClick={() => updateSettings({ streamingSpeed: id })}
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                      ${
                        settings.streamingSpeed === id
                          ? 'border-[var(--primary)] bg-[var(--accent-green-bg)]'
                          : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                      }
                    `}
                  >
                    <span
                      className={`font-medium ${
                        settings.streamingSpeed === id
                          ? 'text-[var(--foreground)]'
                          : 'text-[var(--foreground-muted)]'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">{description}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Other Settings */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Bell size={20} />
              Preferences
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Show Thinking Process</p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Display extended thinking blocks when available
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSettings({ showThinkingProcess: !settings.showThinkingProcess })
                  }
                  className={`
                    w-12 h-6 rounded-full transition-colors relative
                    ${settings.showThinkingProcess ? 'bg-[var(--accent-green)]' : 'bg-[var(--border)]'}
                  `}
                >
                  <span
                    className={`
                      absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                      ${settings.showThinkingProcess ? 'translate-x-7' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Notifications</p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Receive notifications for memory updates
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ notifications: !settings.notifications })}
                  className={`
                    w-12 h-6 rounded-full transition-colors relative
                    ${settings.notifications ? 'bg-[var(--accent-green)]' : 'bg-[var(--border)]'}
                  `}
                >
                  <span
                    className={`
                      absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                      ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Language Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Globe size={20} />
              Language
            </h2>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="w-full p-2 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="en">English</option>
                <option value="pl">Polski</option>
              </select>
              <p className="text-xs text-[var(--foreground-muted)] mt-2">
                RxT-Beta supports English and Polish (65k vocab)
              </p>
            </div>
          </section>

          {/* Account Info */}
          {user && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Account</h2>
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-red)] flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--foreground)]">{user.name}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
