// src/app/admin/users/components/UserRow.tsx
import { User, Vehicle } from "@prisma/client";

type UserWithVehicles = User & { vehicles: Vehicle[] };

interface UserRowProps {
    user: UserWithVehicles;
    onDetailsClick: (user: UserWithVehicles) => void;
}

export default function UserRow({ user, onDetailsClick }: UserRowProps) {
    const firstVehicle = user.vehicles[0];

    return (
        <tr className="hover:bg-zinc-800/50 transition-colors">
            <td className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                    {user.avatarUrl && (
                        <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                    )}
                    <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">
                            {user.name || "Без имени"}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-500 truncate">
                            @{user.username || "—"}
                        </p>
                    </div>
                </div>
            </td>

            <td className="p-3 sm:p-4 hidden md:table-cell">
                <div className="text-sm">
                    {user.email && <p className="truncate">{user.email}</p>}
                    {user.phone && <p className="text-emerald-400 font-medium">{user.phone}</p>}
                </div>
            </td>

            <td className="p-3 sm:p-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    user.role === "ADMIN" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                    {user.role}
                </span>
            </td>

            <td className="p-3 sm:p-4 text-sm">
                {firstVehicle ? (
                    <div>
                        <div className="truncate max-w-[180px]">
                            {firstVehicle.brand} {firstVehicle.model} {firstVehicle.year}
                        </div>
                        {firstVehicle.vin && (
                            <div className="font-mono text-amber-400 text-xs mt-1 truncate">
                                VIN: {firstVehicle.vin}
                            </div>
                        )}
                        {user.vehicles.length > 1 && (
                            <span className="text-zinc-500 text-xs">+{user.vehicles.length - 1}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-zinc-500">—</span>
                )}
            </td>

            <td className="p-3 sm:p-4 text-xs sm:text-sm text-zinc-400 hidden sm:table-cell whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </td>

            <td className="p-3 sm:p-4">
                <button
                    onClick={() => onDetailsClick(user)}
                    className="text-blue-400 hover:text-blue-500 font-medium text-sm whitespace-nowrap"
                >
                    Подробнее
                </button>
            </td>
        </tr>
    );
}