'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  className?: string;
}

const statusColors: Record<string, string> = {
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  neutral: 'text-gray-500',
  warning: 'text-amber-600',
};

const statusBg: Record<string, string> = {
  positive: 'bg-emerald-50',
  negative: 'bg-red-50',
  neutral: 'bg-gray-50',
  warning: 'bg-amber-50',
};

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  status = 'neutral',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            statusBg[status]
          )}
        >
          <span className={cn('h-5 w-5', statusColors[status])}>{icon}</span>
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend === 'up' && status === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : trend === 'up' && status === 'negative'
                  ? 'bg-red-50 text-red-700'
                  : trend === 'down' && status === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : trend === 'down' && status === 'negative'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-600'
            )}
          >
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          {value}
        </p>
        {subtitle && (
          <p className={cn('mt-0.5 text-xs', statusColors[status])}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
