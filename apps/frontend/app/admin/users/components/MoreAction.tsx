'use client';

import { useRouter } from "next/navigation";
import { banUser } from "../action";

export default function MoreAction({
  userId,
}: {
  userId: string;
}) {
    const route = useRouter();
  return (
    <div className="absolute right-0 top-10 z-50 min-w-45 rounded-lg border border-gray-200 bg-white shadow-lg">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-gray-100"
        onClick={async () => {
          await banUser(userId);  
          route.refresh();
        }}
      >
        <span className="material-symbols-outlined">lock</span>
        <span>Ban User</span>
      </button>
    </div>
  );
}