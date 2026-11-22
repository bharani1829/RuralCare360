'use client';

import * as React from 'react';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingRecords: number;
  onToggle?: () => void;
  onSync?: () => void;
}

export function OfflineIndicator({
  isOnline,
  pendingRecords,
  onToggle,
  onSync,
}: OfflineIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-all',
        isOnline
          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'bg-red-50 text-red-700 hover:bg-red-100'
      )}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      title={isOnline ? 'Network: Online' : `Network: Offline (${pendingRecords} pending)`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>{pendingRecords} pending</span>
          {onSync && (
            <Button
              size="icon-xs"
              variant="ghost"
              className="ml-1 h-5 w-5 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onSync();
              }}
              title="Sync now"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
