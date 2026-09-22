'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PulseCard from './PulseCard';

// Used to be a module-level top-level `await axios.get(...)` — it ran once
// when the module first loaded and never again, so a section titled
// "Real-time Platform Pulse" was, in practice, frozen forever. It's now a
// client component seeded with the server-fetched value (no loading flash)
// that actually polls for fresh numbers, so the numbers genuinely move.
type PulseStats = {
  ApiResponseTime: number;
  ActiveSessions: number;
  ServerUptime: number;
};

const REFRESH_INTERVAL_MS = 15_000;

export default function PlatformPulse({ initialStats }: { initialStats: PulseStats }) {
  const [stats, setStats] = useState<PulseStats>(initialStats);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + '/admin/dashboard',
          { withCredentials: true },
        );
        if (!cancelled) setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to refresh platform pulse:', error);
      }
    };

    const id = setInterval(poll, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6">
        Real-time Platform Pulse
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PulseCard
          title="API Response Time"
          value={String(stats.ApiResponseTime)}
          unit="ms"
          icon="bolt"
          bg="bg-primary-fixed-dim"
        />

        <PulseCard
          title="Active Sessions"
          value={String(stats.ActiveSessions)}
          unit="Live"
          icon="sensor_occupied"
          bg="bg-surface-container-high"
        />

        <PulseCard
          title="Server Uptime"
          value={String(stats.ServerUptime)}
          unit="%"
          icon="cloud_done"
          bg="bg-surface-container-highest"
        />
      </div>
    </div>
  );
}
