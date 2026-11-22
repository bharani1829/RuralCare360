'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ReferralTimelineProps {
  steps: { label: string; status: 'completed' | 'current' | 'upcoming' | 'missed' }[];
}

const statusColors = {
  completed: 'bg-emerald-500',
  current: 'bg-blue-500 ring-2 ring-blue-300 animate-pulse',
  upcoming: 'bg-gray-300',
  missed: 'bg-red-500',
};

const statusLineColors = {
  completed: 'bg-emerald-500',
  current: 'bg-blue-500',
  upcoming: 'bg-gray-300',
  missed: 'bg-red-500',
};

export function ReferralTimeline({ steps }: ReferralTimelineProps) {
  return (
    <div className="w-full">
      {/* Desktop - Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'relative h-10 w-10 rounded-full border-2 border-white flex items-center justify-center font-semibold text-white text-xs',
                    statusColors[step.status]
                  )}
                >
                  {step.status === 'completed' && '✓'}
                  {step.status === 'missed' && '✕'}
                </div>
                <p className="text-center text-xs font-medium text-gray-700">
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 -mx-2 h-1 mb-8">
                  <div
                    className={cn('h-full rounded', statusLineColors[step.status])}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile - Vertical */}
      <div className="md:hidden space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            {/* Left connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-8 w-8 rounded-full border-2 border-white flex items-center justify-center font-semibold text-white text-xs',
                  statusColors[step.status]
                )}
              >
                {step.status === 'completed' && '✓'}
                {step.status === 'missed' && '✕'}
              </div>
              {index < steps.length - 1 && (
                <div className={cn('w-1 h-6', statusLineColors[step.status])} />
              )}
            </div>

            {/* Label */}
            <div className="py-1">
              <p className="text-sm font-medium text-gray-900">{step.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
