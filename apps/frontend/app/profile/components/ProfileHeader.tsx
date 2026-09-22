'use client';

import Img from 'next/image';

interface ProfileHeaderProps {
  name: string;
  email: string;
  role: string;
  image?: string;
  setEditOpen: (open: boolean) => void;
}

export default function ProfileHeader({
  name,
  email,
  role,
  image,
  setEditOpen,
}: ProfileHeaderProps) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {image ? (
        <Img
          src={image}
          alt={name || "Profile picture"}
          width={112}
          height={112}
          className="rounded-full object-cover"
          loading="eager"
        />
        ) : (
          <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-7xl text-slate-500">
              account_circle
            </span>
          </div>
        )}

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold">
            {name}
          </h1>

          <p className="text-on-surface-variant mt-1">
            {email}
          </p>

          <span className="inline-block mt-3 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {role}
          </span>
        </div>

        <button className="px-5 py-3 rounded-xl bg-primary text-on-primary font-semibold" onClick={() => setEditOpen(true)}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}