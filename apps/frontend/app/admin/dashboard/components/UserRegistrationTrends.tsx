'use client';

import { useState } from 'react';
import CustomBarChart from './CustomBarChart';

export default function UserRegistrationTrends() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <div className="lg:col-span-2 p-8 rounded-xl bg-surface-container-low">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-on-surface">
            User Registration Trends
          </h3>

          <p className="text-sm text-on-surface-variant">
            Last 6 {isMonthly ? 'months' : 'weeks'} performance analysis
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-lowest ${
              isMonthly ? 'bg-surface-container-lowest shadow-sm' : ''
            }`}
            onClick={() => setIsMonthly(true)}
          >
            Monthly
          </button>

          <button
            className={`px-4 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-lowest ${
              !isMonthly ? 'bg-surface-container-lowest shadow-sm' : ''
            }`}
            onClick={() => setIsMonthly(false)}
          >
            Weekly
          </button>
        </div>
      </div>

      <CustomBarChart isMonthly={isMonthly} />
    </div>
  );
}