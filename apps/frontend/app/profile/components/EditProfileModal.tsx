'use client';

import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditProfileModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body : {
        name : string,
        phone?: string,
      } = { name };
      if (phone) {
        body['phone'] = phone;
      }
      await axios.patch(process.env.NEXT_PUBLIC_URL + `/users/my-data`,
        body, {
          withCredentials: true,
        }
      );
      toast.success('Profile updated successfully');
      onSaved?.();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Edit Profile
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              value={user.email}
              disabled
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}