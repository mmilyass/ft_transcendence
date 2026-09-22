import UserTableRow from "./UserTableRow";
import { UserRow } from "@/types/user";

interface Props {
  users: UserRow[];
}

export default function UsersTable({
  users,
}: Props) {

  return (
    <div className="space-y-4">
      <div className="hidden md:grid md:grid-cols-6 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <div className="col-span-2">
          Name & Identity
        </div>
        <div>Role</div>
        <div>Join Date</div>
        <div>Status</div>
        <div className="text-right">
          Actions
        </div>
      </div>

      {users.map((user) => (
        <UserTableRow
          key={user.id}
          user={user}
        />
      ))}
    </div>
  );
}