"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type TrendData = {
  label: string;
  count: number;
};

export default function AppointmentTrends() {
  const [period, setPeriod] = useState<"weekly" | "monthly">(
    "monthly"
  );

  const [loading, setLoading] = useState(true);

  const [trends, setTrends] = useState<TrendData[]>([]);

  const fetchAppointmentTrends = async (
    selectedPeriod: "weekly" | "monthly"
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/appointments/trends?period=${  selectedPeriod}`
      , {withCredentials: true});
      setTrends(response.data);
    } catch (error) {
      console.error("Error fetching appointment trends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentTrends(period);
  }, [period]);

  if (loading) {
    return (
      <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 text-sm">
            Loading trends...
          </p>
        </div>
      </div>
    );
  }
  const maxCount = Math.max(
    ...trends.map((item) => item.count),
    1
  );

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold font-manrope">
            Appointment Trends
          </h3>

          <p className="text-xs text-slate-500">
            Overview of patient visits
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              period === "weekly"
                ? "text-primary bg-primary/10"
                : "bg-surface-container"
            }`}
          >
            Weekly
          </button>

          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              period === "monthly"
                ? "text-primary bg-primary/10"
                : "bg-surface-container"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 text-sm">
            Loading trends...
          </p>
        </div>
      ) : trends.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 text-sm">
            No data available
          </p>
        </div>
      ) : (
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {trends.map((item) => {
            const height =
              (item.count / maxCount) * 220;

            const isHighest =
              item.count === maxCount;

            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`w-12 rounded-t-lg transition-all relative ${
                    isHighest
                      ? "bg-primary/80"
                      : "bg-slate-200"
                  }`}
                  style={{
                    height: `${Math.max(height, 20)}px`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded">
                    {item.count}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold ${
                    isHighest
                      ? "text-primary"
                      : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}