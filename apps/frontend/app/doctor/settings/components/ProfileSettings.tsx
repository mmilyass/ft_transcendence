"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SettingsSection from "./SettingsSection";
import { User } from "@/app/layout";
import Img from "next/image";

interface ProfileSettingsProps {
  user: User;
}

export default function ProfileSettings({
  user,
}: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: "",
    bio: "",
  });

  const [image, setImage] = useState<File | null>(
    null
  );

  const [previewImage, setPreviewImage] =
    useState<string | null>(
      user.image || null
    );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    const preview =
      URL.createObjectURL(file);

    setPreviewImage(preview);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);

      if (image) {
        data.append("image", image);
      }

      await axios.patch(
        process.env.NEXT_PUBLIC_URL + "/doctor/update-profile",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Profile Information"
      description="Manage your personal account details."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Full Name
          </label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Email Address
          </label>

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Phone Number
          </label>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            placeholder="+212 6 12 34 56 78"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Profile Photo
          </label>

          <div className="flex items-center gap-4 mb-4">
            <Img
              width={80}
              height={80}
              src={
                previewImage ||
                "/default-avatar.png"
              }
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover border border-slate-200"
            />

            <div>
              <p className="text-sm font-medium">
                Profile Preview
              </p>

              <p className="text-xs text-slate-500">
                Select a new image to
                update your avatar.
              </p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        {/* Biography */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">
            Biography
          </label>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell patients about yourself..."
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </SettingsSection>
  );
}