'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BackButton from '@/components/BackButton';

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ViewAllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + '/notification/mine',
          {
            withCredentials: true,
          }
        );

        setNotifications(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load notifications');
      }
    };

    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axios.patch(
        process.env.NEXT_PUBLIC_URL + '/notification/mark-all-read',
        {},
        {
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const markRead = async (notificationId: number) => {
    try {
      await axios.patch(
        process.env.NEXT_PUBLIC_URL + `/notification/mark-read/${notificationId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark notification as read');
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <div className="mx-auto max-w-4xl p-6 grid gap-6">
      <BackButton />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Notifications
          </h1>

          <p className="text-sm text-slate-500">
            {unreadCount} unread notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="self-start sm:self-auto rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markRead(notification.id)}
              className={`w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                !notification.isRead
                  ? 'bg-blue-50'
                  : 'bg-white'
              }`}
            >
              <div className="flex gap-3">
                {!notification.isRead && (
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}

                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}