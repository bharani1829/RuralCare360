'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed';
  icon?: React.ReactNode;
}

interface PatientTimelineProps {
  items: TimelineItem[];
}

const statusColors = {
  completed: 'bg-emerald-500 border-emerald-500',
  current: 'bg-white border-blue-500 ring-2 ring-blue-500',
  upcoming: 'bg-gray-300 border-gray-300',
  missed: 'bg-red-500 border-red-500',
};

const statusLineColors = {
  completed: 'from-emerald-500',
  current: 'from-blue-500',
  upcoming: 'from-gray-300',
  missed: 'from-red-500',
};

export function PatientTimeline({ items }: PatientTimelineProps) {
  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline connector */}
          <div className="relative flex flex-col items-center">
            {/* Dot */}
            <div
              className={cn(
                'relative z-10 h-4 w-4 rounded-full border-2',
                statusColors[item.status]
              )}
            >
              {item.icon && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  {item.icon}
                </div>
              )}
            </div>
            {/* Line to next */}
            {index < items.length - 1 && (
              <div
                className={cn(
                  'mt-1 w-0.5 flex-1 bg-gradient-to-b to-gray-200',
                  statusLineColors[item.status]
                )}
                style={{ minHeight: '60px' }}
              />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 pb-6 pt-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{item.date}</p>
                <h4 className="mt-0.5 font-semibold text-gray-900">{item.title}</h4>
              </div>
              {item.status === 'missed' && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                  Missed
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
