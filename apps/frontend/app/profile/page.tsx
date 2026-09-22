"use client";

import ProfileHeader from "./components/ProfileHeader";
import PatientStats from "./components/PatientStats";
import PersonalInformation from "./components/PersonalInformation";
import BackButton from "@/components/BackButton"
import { useEffect, useState } from "react";
import axios from "axios";
import EditProfileModal from "./components/EditProfileModal";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string | null;
  phone?: string | null;
  stats: {
    Appointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    pendingAppointments: number;
    Reviews: number;
  };
  
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/users/my-data`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-on-surface-variant">
          User not found.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BackButton />

        <ProfileHeader
          name={user.name}
          email={user.email}
          role={user.role}
          image={user.image ?? undefined}
          setEditOpen={setEditOpen}
        />

        <PatientStats stats={user.stats} />

        <div className="grid lg:grid-cols-2 gap-8">
          <PersonalInformation
            email={user.email}
            phone={user.phone ?? ""}
            address=""
            birthDate=""
          />
        </div>
      </div>
      {editOpen && (
        <EditProfileModal
          onClose={() => setEditOpen(false)}
          onSaved={fetchUserData}
          user={{
            name: user.name,
            email: user.email,
            role: user.role,
            }}
        />
      )}
    </main>
  );
}