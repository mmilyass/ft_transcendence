'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p>Loading dashboard...</p>
    </div>
  );
}