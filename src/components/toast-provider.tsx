'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  toast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const config = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((t) => {
          const c = config[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg border p-3 animate-in slide-in-from-top-2 fade-in',
                c.bg,
                c.border,
                c.text
              )}
            >
              <p className="text-sm font-medium">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
