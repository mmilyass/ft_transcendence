'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/layout';
import {
  fetchMyReviewsApi,
  fetchMyBookingsApi,
  fetchDoctorBookingsApi,
} from '@/lib/api';

export default function PrivacyDataSettings() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const accountRes = await axios.get(
        process.env.NEXT_PUBLIC_URL + '/users/me/export',
        { withCredentials: true },
      );

      const [reviews, patientBookings, doctorBookings] = await Promise.all([
        fetchMyReviewsApi().catch(() => []),
        user?.role === 'USER' ? fetchMyBookingsApi().catch(() => []) : Promise.resolve([]),
        user?.role === 'DOCTOR' ? fetchDoctorBookingsApi().catch(() => []) : Promise.resolve([]),
      ]);

      const payload = {
        ...accountRes.data,
        reviewsWritten: reviews,
        patientBookings,
        doctorBookings,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Your data was exported. A confirmation email is on its way.');
    } catch (error) {
      console.error('Data export failed:', error);
      toast.error('Failed to export your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/users/${user.sub}`,
        { withCredentials: true },
      );
      toast.success('Your account has been deleted.');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast.error('Failed to delete your account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-2">Privacy &amp; Data</h2>
      <p className="text-sm text-on-surface-variant mb-6">
        Export a copy of your data at any time, or permanently delete your
        account. Both actions send you a confirmation email.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-3 rounded-xl border hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? 'Preparing export…' : 'Export My Data'}
        </button>

        <button
          onClick={() => setConfirmOpen(true)}
          className="w-full py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete your account?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              This permanently deletes your account and data. This cannot be undone.
              Type <span className="font-mono font-bold">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="DELETE"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText('');
                }}
                className="flex-1 py-2 rounded-xl border hover:bg-surface-variant transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleting}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
