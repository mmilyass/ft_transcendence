'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface CustomBarChartProps {
  isMonthly: boolean;
}

interface RegistrationData {
  label: string;
  count: number;
}

export default function CustomBarChart({ isMonthly }: CustomBarChartProps) {
  const [registrationData, setRegistrationData] = useState<
    RegistrationData[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + `/admin/users-registration-trends/period=${
            isMonthly ? 'monthly' : 'weekly'
          }`,
          { withCredentials: true }
        );

        setRegistrationData(response.data);
      } catch (error) {
        console.error('Failed to fetch registration trends:', error);
        setRegistrationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [isMonthly]);

  const exportCsv = () => {
    const rows = [
      ['Period', 'New Registrations'],
      ...registrationData.map((item) => [item.label, String(item.count)]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registration-trends-${isMonthly ? 'monthly' : 'weekly'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  const maxCount = Math.max(
    ...registrationData.map((item) => item.count),
    1
  );

  return (
    <>
    <div className="flex justify-end mb-2">
      <button
        type="button"
        onClick={exportCsv}
        disabled={registrationData.length === 0}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-sm">download</span>
        Export CSV
      </button>
    </div>
    <div className="flex items-end justify-between h-64 px-4 gap-4">
      {registrationData.map((item, index) => {
        const isLast = index === registrationData.length - 1;
        const height = `${(item.count / maxCount) * 100}%`;

        return (
          <div
            key={item.label}
            className="flex-1 flex flex-col items-center justify-end gap-2 h-full group"
          >
            <span className="text-xs font-semibold text-on-surface">
              {item.count}
            </span>

            <div
              className={
                isLast
                  ? 'w-1/2 bg-primary rounded-t-xl shadow-lg shadow-primary/20'
                  : 'w-1/2 bg-primary-fixed-dim rounded-t-xl group-hover:bg-primary transition-all duration-500'
              }
              style={{ height }}
            />

            <span
              className={
                isLast
                  ? 'text-[10px] font-bold text-on-surface uppercase'
                  : 'text-[10px] font-bold text-on-surface-variant uppercase'
              }
            >
              {item.label}
            </span>
            </div>
        );
      })}
    </div>
    </>
  );
}