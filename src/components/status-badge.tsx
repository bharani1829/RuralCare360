'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'critical'
  | 'routine'
  | 'priority'
  | 'emergency'
  | 'low'
  | 'medium'
  | 'high'
  | 'waiting'
  | 'in-progress'
  | 'completed'
  | 'operational'
  | 'limited'
  | 'closed'
  | (string & {});

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const baseConfig: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  success: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  warning: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  danger: {
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  info: {
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  neutral: {
    dot: 'bg-gray-400',
    text: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
  critical: {
    dot: 'bg-violet-500',
    text: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
};

// Aliases for domain statuses
const config: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  ...baseConfig,
  routine: baseConfig.success,
  low: baseConfig.success,
  operational: baseConfig.success,
  completed: baseConfig.success,
  priority: baseConfig.warning,
  medium: baseConfig.warning,
  limited: baseConfig.warning,
  waiting: baseConfig.warning,
  'in-progress': baseConfig.info,
  emergency: baseConfig.danger,
  high: baseConfig.danger,
  closed: baseConfig.neutral,
};

const sizeClasses: Record<string, { wrapper: string; dot: string; text: string }> = {
  sm: { wrapper: 'px-1.5 py-0.5', dot: 'h-1.5 w-1.5', text: 'text-[10px]' },
  md: { wrapper: 'px-2 py-0.5', dot: 'h-2 w-2', text: 'text-xs' },
  lg: { wrapper: 'px-2.5 py-1', dot: 'h-2 w-2', text: 'text-sm' },
};

export function StatusBadge({
  status = 'neutral',
  label,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const c = config[status] || config[status?.toLowerCase()] || baseConfig.neutral;
  const s = sizeClasses[size] || sizeClasses.md;
  const displayLabel = label ?? status ?? '';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        c.bg,
        c.border,
        c.text,
        s.wrapper,
        s.text,
        className
      )}
      role="status"
      aria-label={`${displayLabel} — ${status}`}
    >
      <span className={cn('shrink-0 rounded-full', c.dot, s.dot)} aria-hidden="true" />
      {displayLabel}
    </span>
  );
}
