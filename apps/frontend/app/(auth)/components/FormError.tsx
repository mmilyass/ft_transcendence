'use client';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function FormError({ message, onDismiss }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  );
}
