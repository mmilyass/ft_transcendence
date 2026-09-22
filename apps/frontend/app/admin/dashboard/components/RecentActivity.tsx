'use client';

import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ActivityItem from './ActivityItem';

interface Activity {
  title: string;
  description: string;
  time: string;
  image?: string | null;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + '/admin/recent-activities',
          {
            withCredentials: true,
          }
        );

        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="p-8 rounded-xl bg-surface-container-lowest">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-on-surface">
          Recent Activity
        </h3>

        <Link
          href="/admin/activity-logs"
          className="text-primary text-xs font-bold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-on-surface-variant">
            No recent activities.
          </p>
        ) : (
          activities.map((activity, index) => (
            <ActivityItem
              key={`${activity.title}-${activity.time}-${index}`}
              title={activity.title}
              description={activity.description}
              image={activity.image}
              time={formatDistanceToNow(
                new Date(activity.time),
                { addSuffix: true }
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}