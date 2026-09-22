'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatNotificationDate } from "./date";

export type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell({ onUnreadCountChange }: { onUnreadCountChange: (count: number) => void }) {
    const router = useRouter();

  const [Notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/notification/mine", {
                withCredentials: true,
            });
            router.refresh();
            onUnreadCountChange(response.data.filter((n: Notification) => !n.isRead).length);
            setNotifications(response.data);
        } catch (error) {
            console.log("Error fetching notifications:", error);
            setNotifications([]);
        }
    };

    fetchNotifications();
  }, [router, onUnreadCountChange]);
  const unreadCount = Notifications?.filter(n => !n.isRead).length ?? 0;

  return (
        <div
            className="
                fixed md:absolute
                top-16 md:top-14
                left-2 right-2 md:left-auto md:right-0
                z-50
                w-auto md:w-105
                max-h-[80vh]
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-xl
                overflow-hidden
            "
            >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
            <h3 className="font-semibold text-slate-900">
            Notifications
            </h3>

            {unreadCount > 0 && (
            <p className="text-xs text-slate-500">
                {unreadCount} unread
            </p>
            )}
        </div>

        {unreadCount > 0 && (
            <button
            className="text-sm text-blue-600 hover:text-blue-700"
            onClick={() => {
                axios
                .patch(
                    process.env.NEXT_PUBLIC_URL + "/notification/mark-all-read",
                    {},
                    {
                    withCredentials: true,
                    }
                )
                .then(() => {
                    setNotifications(
                    prev =>
                        prev?.map(n => ({
                        ...n,
                        isRead: true,
                        })) || []
                    );

                    onUnreadCountChange(0);
                })
                .catch(error => {
                    console.error(error);
                    toast.error(
                    "Failed to mark all notifications as read"
                    );
                });
            }}
            >
            Mark all as read
            </button>
        )}
        </div>

        <div className="max-h-100 overflow-y-auto">
        {Notifications?.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
            No notifications
            </div>
        ) : (
            Notifications?.slice(0, 5).map((notification) => (
            <div
                key={notification.id}
                className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all duration-200 ${
                !notification.isRead
                    ? "bg-blue-50/60"
                    : "bg-white"
                }`}
                onClick={() => {
                if (!notification.isRead) {
                    axios
                    .patch(
                        process.env.NEXT_PUBLIC_URL + `/notification/mark-read/${notification.id}`,
                        {},
                        { withCredentials: true }
                    )
                    .then(() => {
                        setNotifications(
                        prev =>
                            prev?.map(n =>
                            n.id === notification.id
                                ? { ...n, isRead: true }
                                : n
                            ) || []
                        );

                        onUnreadCountChange(
                        Math.max(0, unreadCount - 1)
                        );
                    })
                    .catch(error => {
                        console.error(error);
                        toast.error(
                        "Failed to mark notification as read"
                        );
                    });
                }
                }}
            >
                <div className="flex gap-3">
                {!notification.isRead && (
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                )}

                <div className="flex-1">
                    <p
                    className={`text-sm font-semibold ${
                        !notification.isRead
                        ? "text-blue-700"
                        : "text-slate-900"
                    }`}
                    >
                    {notification.title}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-600">
                    {notification.message}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                    {formatNotificationDate(
                        notification.createdAt
                    )}
                    </p>
                </div>
                </div>
            </div>
            ))
        )}
        </div>
    {Notifications && Notifications.length > 5 && (
    <div className="border-t border-slate-200 p-3">
        <button
        className="w-full rounded-lg bg-slate-100 py-2 text-sm font-medium hover:bg-slate-200"
        onClick={() => router.push("/notification")}
        >
        View all notifications ({Notifications.length})
        </button>
    </div>
    )}
    </div>
  );
}