'use client';

import Img from 'next/image';
import { UserRow } from "@/types/user";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UsersAction from './UsersAction';
import { useAuth } from '@/app/layout';
interface Props {
  user: UserRow;
}

export default function UserTableRow({ user }: Props) {
  const { user: currentUser, loading } = useAuth();
  const date = new Date("2026-06-26T08:43:29.189Z");

  const formatted = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <div>Please log in to view this content.</div>;
  }
  return (
    <div className="bg-surface-container-lowest rounded-xl hover:bg-surface-bright group">
      {/* Mobile card layout */}
      <div className="md:hidden flex items-center gap-4 px-4 py-4">
        <Img width={40} height={40} src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-on-surface truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.verified ? "Active" : "Inactive"} />
          </div>
        </div>
        <UsersAction userId={user.id} status={user.verified.toString()} role={user.role} />
      </div>

      {/* Desktop row layout */}
      <div className="hidden md:grid md:grid-cols-6 items-center px-6 py-4">
        <div className="col-span-2 flex items-center gap-4">
          <Img width={40} height={40} src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-bold text-on-surface">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <div><UserRoleBadge role={user.role} /></div>
        <div>{formatted}</div>
        <div><UserStatusBadge status={user.verified ? "Active" : "Inactive"} /></div>
        <div className="flex justify-end gap-2">
          <UsersAction userId={user.id} status={user.verified.toString()} role={user.role} />
        </div>
      </div>
    </div>
  );
}