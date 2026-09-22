'use client';

import { useState } from 'react';
import { approveUser, deleteUser, disableUser } from '../action';
import MoreAction from './MoreAction';
import { useRouter } from "next/navigation";

export default function UsersAction({
  userId,
  status,
  role,
}: {
  userId: string;
  status: string;
  role: string;
}) {
  const [showMore, setShowMore] = useState(false);
  const route = useRouter();
  return (
    <div className="relative flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {role === 'BANNED' ? (
        <button
          className="p-2 hover:text-green-500"
          onClick={async () => {
            await approveUser(userId);
            route.refresh();
          }}
        >
          <span className="material-symbols-outlined">
            check_circle
          </span>
        </button>
      ) : status === 'true' ? (
        <button
          className="p-2 hover:text-yellow-500"
          onClick={async () => {
            await disableUser(userId);
            route.refresh();
          }}
        >
          <span className="material-symbols-outlined">
            block
          </span>
        </button>
      ) : (
        <button
          className="p-2 hover:text-green-500"
          onClick={async () => {
            await approveUser(userId);
            route.refresh();
          }}
        >
          <span className="material-symbols-outlined">
            check_circle
          </span>
        </button>
      )}

      <button
        className="p-2 hover:text-red-500"
        onClick={async () => { await deleteUser(userId);
            route.refresh();
        }}
      >
        <span className="material-symbols-outlined">
          delete
        </span>
      </button>

      <button
        className="p-2 hover:text-primary"
        onClick={() => setShowMore((prev) => !prev)}
      >
        <span className="material-symbols-outlined">
          more_vert
        </span>
      </button>

      {showMore && <MoreAction userId={userId}   />}
    </div>
  );
}