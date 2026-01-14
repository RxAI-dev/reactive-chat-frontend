'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-10 px-3 rounded-lg
              bg-[var(--input-bg)] text-[var(--foreground)]
              border border-[var(--border)]
              placeholder:text-[var(--foreground-muted)]
              focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)] focus:ring-[var(--accent-red)]' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-[var(--accent-red)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full min-h-[100px] px-3 py-2 rounded-lg resize-y
            bg-[var(--input-bg)] text-[var(--foreground)]
            border border-[var(--border)]
            placeholder:text-[var(--foreground-muted)]
            focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${error ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)] focus:ring-[var(--accent-red)]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-[var(--accent-red)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
