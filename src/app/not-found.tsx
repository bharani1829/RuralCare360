import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="max-w-md text-sm text-gray-600 mb-6">
        The requested healthcare portal module or patient route could not be found.
      </p>
      <Link href="/dashboard">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
