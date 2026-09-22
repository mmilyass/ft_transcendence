'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ActivityItem from '../dashboard/components/ActivityItem';

interface Activity {
  title: string;
  description: string;
  time: string;
  image?: string | null;
}

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL+ '/admin/activity-logs?page=1&limit=1000',
          {withCredentials: true,}
        );

        if (Array.isArray(response.data.activities)) {
          setActivities(response.data.activities);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    const query = searchName.trim().toLowerCase();
    if (!query) return activities;
    return activities.filter((activity) =>
      activity.title.toLowerCase().includes(query)
    );
  }, [activities, searchName]);

  if (loading) {
    return <div className="p-8">Loading activity logs...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="mb-6 flex gap-2">
        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search by name"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none"
        />
        <button
          type="button"
          onClick={() => setSearchName(searchName.trim())}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Search
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8">
        {filteredActivities.length === 0 ? (
          <p className="text-on-surface-variant">No activity logs found.</p>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <ActivityItem
                key={`${activity.title}-${activity.time}-${index}`}
                {...activity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}