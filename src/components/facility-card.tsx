'use client';

import * as React from 'react';
import { Check, X, MapPin, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FacilityCardProps {
  name: string;
  type: string;
  distance: number;
  doctorAvailable: boolean;
  diagnosticsAvailable: string[];
  diagnosticsUnavailable: string[];
  medicineAvailable: boolean;
  queueLength: number;
  status: string;
  matchScore?: number;
  onSelect?: () => void;
  recommended?: boolean;
}

export function FacilityCard({
  name,
  type,
  distance,
  doctorAvailable,
  diagnosticsAvailable,
  diagnosticsUnavailable,
  medicineAvailable,
  queueLength,
  status,
  matchScore,
  onSelect,
  recommended,
}: FacilityCardProps) {
  const statusColor =
    status === 'operational'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'limited'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 p-4 transition-all duration-200',
        recommended
          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
          : 'border-gray-200 bg-white hover:shadow-md'
      )}
    >
      {recommended && (
        <div className="absolute -top-2 left-4 inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
          ✓ BEST MATCH
        </div>
      )}

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {type}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  statusColor
                )}
              >
                {status}
              </span>
            </div>
          </div>
          {matchScore && (
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">{matchScore}%</div>
              <div className="text-xs text-gray-600">Match</div>
            </div>
          )}
        </div>

        {/* Distance and Queue */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {distance} km
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {queueLength} waiting
          </span>
        </div>

        {/* Services Grid */}
        <div className="space-y-2 border-t pt-3">
          {/* Doctor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Doctor</span>
            {doctorAvailable ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <X className="h-4 w-4 text-red-600" />
            )}
          </div>

          {/* Medicine */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Medicine</span>
            {medicineAvailable ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <X className="h-4 w-4 text-red-600" />
            )}
          </div>

          {/* Diagnostics Available */}
          {diagnosticsAvailable.length > 0 && (
            <div>
              <p className="text-xs font-medium text-emerald-700">
                Available: {diagnosticsAvailable.join(', ')}
              </p>
            </div>
          )}

          {/* Diagnostics Unavailable */}
          {diagnosticsUnavailable.length > 0 && (
            <div className="flex items-start gap-1">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-700">
                Unavailable: {diagnosticsUnavailable.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Action */}
        {onSelect && (
          <Button
            onClick={onSelect}
            size="sm"
            className="w-full"
            variant={recommended ? 'default' : 'outline'}
          >
            Select Facility
          </Button>
        )}
      </div>
    </div>
  );
}
