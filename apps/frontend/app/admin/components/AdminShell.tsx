'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNotifications from './AdminNotifications';

type AdminShellProps = {
  children: React.ReactNode;
  activePage?: 'dashboard' | 'users' | 'doctors' | 'settings';
};

export default function AdminShell({ children, activePage }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen overflow-y-auto bg-slate-50">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 lg:hidden top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-slate-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <span className="font-bold text-slate-900 text-lg">
            Maou<span className="text-blue-500">3</span>idy
          </span>
        </div>
      <AdminNotifications />
      </div>

      <AdminSidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Offset content: below mobile bar on small, behind fixed admin header on lg */}
      <div className="flex-1 flex flex-col min-h-screen pt-14 lg:pt-0 lg:ml-64">
        {children}
      </div>
    </div>
  );
}
