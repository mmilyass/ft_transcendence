'use client';

import Img from 'next/image';
import { useRef } from 'react';

interface ProfileMenuHeaderProps {
  name: string;
  email: string;
  image?: string | null;
  onImageChange?: (file: File) => void;
}

export default function ProfileMenuHeader({
  name,
  email,
  image,
  onImageChange,
}: ProfileMenuHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 flex items-center gap-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-14 h-14 rounded-full overflow-hidden group cursor-pointer"
        >
          {image ? (
            <Img
              src={image}
              alt={name}
              fill
              sizes="56px"
              className="object-cover transition-opacity duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-500">
                account_circle
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-300 text-lg">
              photo_camera
            </span>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file && onImageChange) {
              onImageChange(file);
            }
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-900 truncate">
          {name}
        </h3>

        <p className="text-sm text-slate-500 truncate">
          {email}
        </p>
      </div>
    </div>
  );
}