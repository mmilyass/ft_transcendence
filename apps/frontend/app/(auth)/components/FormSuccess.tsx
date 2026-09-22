'use client';
import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function FormSuccess({ message, onDismiss }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-400 hover:text-green-600 transition-colors"
        >
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  );
}
