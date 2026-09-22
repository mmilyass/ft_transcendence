'use client';

import { useRouter } from "next/navigation";

export default function SecuritySettings() {
  const router = useRouter();
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Security
      </h2>

      <div className="space-y-4">
        <button onClick={() => {router.push('/change-password')}} className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors hover:shadow-lg cursor-pointer">
          Change Password
        </button>
        <button className="w-full py-3 rounded-xl border hover:bg-surface-variant transition-colors cursor-pointer">
          Logout From All Devices
        </button>
      </div>
    </div>
  );
}