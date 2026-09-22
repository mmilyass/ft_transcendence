'use client';

import ProfileMenuItem from './ProfileMenuItem';

interface ProfileMenuFooterProps {
  onLogout: () => void;
}

export default function ProfileMenuFooter({
  onLogout,
}: ProfileMenuFooterProps) {
  return (
    <div className="border-t border-slate-200">
      <ProfileMenuItem
        icon="logout"
        label="Logout"
        onClick={onLogout}
        danger
      />
    </div>
  );
}