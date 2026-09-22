"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SettingsSection from "./SettingsSection";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleUpdateSecurity = async () => {
    if (!currentPassword) {
      toast.error(
        "Current password is required"
      );
      return;
    }

    if (!newPassword) {
      toast.error(
        "New password is required"
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        process.env.NEXT_PUBLIC_URL + "/auth/change-password",
        {
          old_password:
            currentPassword,
          new_password: newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Password updated successfully"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Security"
      description="Manage password and account security."
    >
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container p-4 opacity-60">
          <div>
            <h4 className="font-semibold">
              Two-Factor Authentication
            </h4>

            <p className="text-sm text-on-surface-variant">
              Coming soon.
            </p>
          </div>

          <input
            type="checkbox"
            disabled
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={
            handleUpdateSecurity
          }
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Security"}
        </button>
      </div>
    </SettingsSection>
  );
}