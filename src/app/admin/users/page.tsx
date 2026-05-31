// src/app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { User, Vehicle } from "@prisma/client";
import UsersTable from "@/features/admin/components/users/UsersTable";
import UserModal from "@/features/admin/components/users/UserModal";


type UserWithVehicles = User & {
    vehicles: Vehicle[];
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserWithVehicles[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserWithVehicles | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.phone?.toLowerCase() || "").includes(search.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Пользователи</h1>
                <input
                    type="text"
                    placeholder="Поиск по имени, email, телефону..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 w-full sm:w-96 focus:outline-none focus:border-blue-600 text-sm"
                />
            </div>

            <UsersTable
                users={filteredUsers}
                onDetailsClick={setSelectedUser}
            />

            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}