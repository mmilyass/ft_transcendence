'use client';

interface Activity {
  title: string;
  time: string;
}

export default function RecentActivity({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={`${activity.title}-${index}`}
            className="flex justify-between items-center border-b border-outline-variant pb-4"
          >
            <div>
              <p className="font-medium">
                {activity.title}
              </p>
            </div>

            <span className="text-sm text-on-surface-variant">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}