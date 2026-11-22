'use client';

import * as React from 'react';
import { User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientCardProps {
  id?: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  primaryCondition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  careStage: string;
  onClick?: () => void;
}

const riskColors: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
  critical: 'bg-red-100 text-red-800 font-medium',
};

const stageColors: Record<string, string> = {
  registered: 'bg-blue-50 text-blue-700',
  triaged: 'bg-purple-50 text-purple-700',
  consulted: 'bg-indigo-50 text-indigo-700',
  referred: 'bg-yellow-50 text-yellow-700',
  appointment: 'bg-orange-50 text-orange-700',
  arrived: 'bg-green-50 text-green-700',
  treated: 'bg-teal-50 text-teal-700',
  'follow-up': 'bg-pink-50 text-pink-700',
  closed: 'bg-gray-50 text-gray-700',
};

export function PatientCard({
  name,
  age,
  gender,
  village,
  primaryCondition,
  riskLevel,
  careStage,
  onClick,
}: PatientCardProps) {
  return (
    <div
      className={cn(
        'group relative flex h-14 w-full cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-sm hover:border-gray-300 hover:-translate-y-0.5',
        onClick && 'hover:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : -1}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
        <User className="h-4 w-4 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between w-full">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <TimeBadge
            status={careStage as keyof typeof stageColors}
            label={careStage.replace('-', ' ')}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" /> {village}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-medium">{age}</span>
          <span className="mx-1">•</span>
          <span className="capitalize">{gender}</span>
        </div>
        <RiskBadge level={riskLevel} />
        <p className="mt-1 text-xs text-gray-600 line-clamp-1">
          {primaryCondition}
        </p>
      </div>
    </div>
  );
}

function TimeBadge({
  status,
  label,
}: {
  status: keyof typeof stageColors;
  label: string;
}) {
  const bg = stageColors[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        bg
      )}
    >
      {label}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const bg = riskColors[level];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        bg
      )}
    >
      {level}
    </span>
  );
}
