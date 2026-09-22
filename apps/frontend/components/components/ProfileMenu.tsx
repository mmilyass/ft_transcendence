"use client";

import { useRouter } from "next/navigation";
import ProfileMenuHeader from "./ProfileMenuHeader";
import ProfileMenuItem from "./ProfileMenuItem";
import ProfileMenuFooter from "./ProfileMenuFooter";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
}

export default function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const router = useRouter();
  const [image, setImage] = useState(user.image || null);

  const handleImageChange = async (file: File) => {
    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_URL + "/users/profile-image",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Refresh user data
      setImage(response.data.image);
      router.refresh();
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile image");
    }
  };

  return (
    <div
      className="
      absolute
      right-0
      top-14
      w-80
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-xl
      overflow-hidden
      z-50
    "
    >
      <ProfileMenuHeader
        name={user.name}
        email={user.email}
        image={image}
        onImageChange={handleImageChange}
      />

      <div className="border-t border-slate-200 py-2">
        {(user.role === "ADMIN" || user.role === "DOCTOR") && (
          <ProfileMenuItem
            icon="dashboard"
            label="Dashboard"
            onClick={() =>
              router.push(
                user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : "/doctor/dashboard",
              )
            }
          />
        )}
        <ProfileMenuItem
          icon="person"
          label="Profile"
          onClick={() => router.push("/profile")}
        />
        <ProfileMenuItem
          icon="dashboard_customize"
          label="Your Dashboard"
          onClick={() => router.push("/appointments")}
        />
        <ProfileMenuItem
          icon="lock"
          label="Change Password"
          onClick={() => router.push("/change-password")}
        />
        <ProfileMenuItem
          icon="settings"
          label="Settings"
          onClick={() =>
            router.push(
              user.role === "ADMIN"
                ? "/admin/settings"
                : user.role === "DOCTOR"
                  ? "/doctor/settings"
                  : "/settings",
            )
          }
        />

        <ProfileMenuItem
          icon="help"
          label="Help Center"
          onClick={() => router.push("/help")}
        />
      </div>

      <ProfileMenuFooter onLogout={onLogout} />
    </div>
  );
}
