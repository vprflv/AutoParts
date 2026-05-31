import { User, Vehicle } from "@prisma/client";
import UserRow from "./UserRow";

type UserWithVehicles = User & { vehicles: Vehicle[] };

interface UsersTableProps {
    users: UserWithVehicles[];
    onDetailsClick: (user: UserWithVehicles) => void;
}

export default function UsersTable({ users, onDetailsClick }: UsersTableProps) {
    return (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="border-b border-zinc-800 bg-zinc-950">
                    <tr>
                        <th className="text-left p-3 sm:p-4 text-zinc-400 w-56">Пользователь</th>
                        <th className="text-left p-3 sm:p-4 text-zinc-400 hidden md:table-cell">Контакты</th>
                        <th className="text-left p-3 sm:p-4 text-zinc-400">Роль</th>
                        <th className="text-left p-3 sm:p-4 text-zinc-400">Авто / VIN</th>
                        <th className="text-left p-3 sm:p-4 text-zinc-400 hidden sm:table-cell">Регистрация</th>
                        <th className="w-20 sm:w-28"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onDetailsClick={onDetailsClick}
                        />
                    ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-12 text-center text-zinc-500">
                    Пользователи не найдены
                </div>
            )}
        </div>
    );
}