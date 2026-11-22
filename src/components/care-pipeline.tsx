'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarePipelineProps {
  stages: { label: string; count: number; status: 'active' | 'inactive' }[];
}

export function CarePipeline({ stages }: CarePipelineProps) {
  return (
    <div className="w-full">
      {/* Desktop - Horizontal Pipeline */}
      <div className="hidden lg:block overflow-x-auto pb-2">
        <div className="flex items-center justify-between gap-1 min-w-[760px]">
          {stages.map((stage, index) => {
            const displayLabel =
              stage.label && !stage.label.includes('.')
                ? stage.label
                : ['Registered', 'Triaged', 'Consulted', 'Referred', 'Appointment', 'Arrived', 'Treated', 'Follow-up', 'Closed'][index] || stage.label;

            return (
              <React.Fragment key={index}>
                {/* Stage Step */}
                <div className="flex flex-1 flex-col items-center gap-1.5 min-w-0">
                  <div
                    className={cn(
                      'relative flex h-11 w-full items-center justify-center rounded-lg border font-semibold text-sm transition-all shadow-xs',
                      stage.status === 'active'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    )}
                  >
                    <span className="text-base font-bold">{stage.count}</span>
                  </div>
                  <p className="text-center text-xs font-semibold text-gray-700 truncate w-full px-0.5" title={displayLabel}>
                    {displayLabel}
                  </p>
                </div>

                {/* Arrow */}
                {index < stages.length - 1 && (
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 -mt-5',
                      stage.status === 'active' ? 'text-emerald-500' : 'text-gray-300'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tablet & Mobile - Grid / List */}
      <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stages.map((stage, index) => {
          const displayLabel =
            stage.label && !stage.label.includes('.')
              ? stage.label
              : ['Registered', 'Triaged', 'Consulted', 'Referred', 'Appointment', 'Arrived', 'Treated', 'Follow-up', 'Closed'][index] || stage.label;

          return (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium',
                stage.status === 'active'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-gray-200 bg-gray-50 text-gray-700'
              )}
            >
              <span className="truncate">{displayLabel}</span>
              <span className="ml-2 font-bold px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800 shadow-2xs">
                {stage.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
