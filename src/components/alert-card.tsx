'use client';

import * as React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AlertCardProps {
  type: 'emergency' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp?: string;
  action?: { label: string; onClick: () => void };
}

const config = {
  emergency: {
    icon: AlertTriangle,
    border: 'border-l-4 border-l-red-600',
    bg: 'bg-red-50',
    title: 'text-red-900',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800',
  },
  warning: {
    icon: AlertCircle,
    border: 'border-l-4 border-l-amber-500',
    bg: 'bg-amber-50',
    title: 'text-amber-900',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-800',
  },
  info: {
    icon: Info,
    border: 'border-l-4 border-l-blue-500',
    bg: 'bg-blue-50',
    title: 'text-blue-900',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800',
  },
  success: {
    icon: CheckCircle,
    border: 'border-l-4 border-l-emerald-500',
    bg: 'bg-emerald-50',
    title: 'text-emerald-900',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800',
  },
};

export function AlertCard({
  type,
  title,
  message,
  timestamp,
  action,
}: AlertCardProps) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <div
      className={cn('flex gap-3 rounded-lg p-4', c.border, c.bg)}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-current" />
      <div className="flex-1 min-w-0">
        <h3 className={cn('font-semibold', c.title)}>{title}</h3>
        <p className={cn('mt-1 text-sm', c.text)}>{message}</p>
        {(timestamp || action) && (
          <div className="mt-2 flex items-center justify-between gap-2">
            {timestamp && (
              <span className={cn('text-xs flex items-center gap-1', c.text)}>
                <Clock className="h-3 w-3" />
                {timestamp}
              </span>
            )}
            {action && (
              <Button
                onClick={action.onClick}
                size="sm"
                variant="ghost"
                className={c.badge}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
