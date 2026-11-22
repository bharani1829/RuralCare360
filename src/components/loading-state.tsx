'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
