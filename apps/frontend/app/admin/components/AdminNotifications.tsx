'use client';

import NotificationBell from '@/components/NotificationBell';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AdminNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + '/notification/unread-count',
          {
            withCredentials: true,
          }
        );

        // Backend returns a bare count number, not { count }.
        setUnreadCount(response.data);
      } catch (error) {
        console.error(
          'Error fetching unread notifications count:',
          error
        );
      }
    };

    fetchUnreadCount();
  }, []);


    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;

        if (
          notificationRef.current &&
          !notificationRef.current.contains(target)
        ) {
          setOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener(
          'mousedown',
          handleClickOutside
        );
      };
    }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-all"
      >
        <span className="material-symbols-outlined">
          notifications
        </span>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationBell
          onUnreadCountChange={setUnreadCount}
        />
      )}
    </div>
  );
}