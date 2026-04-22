"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import AdminSidebar from "@/src/features/admin/components/AdminSidebar";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    // useEffect(() => {
    //     if (user === null) {
    //         // Если пользователь точно не авторизован — кидаем на главную
    //         router.push("/");
    //     } else if (user !== undefined) {
    //         // Если пользователь уже загружен — разрешаем доступ
    //         setIsChecking(false);
    //     }
    // }, [user, router]);

    // Пока идёт проверка
    // if (isChecking) {
    //     return (
    //         <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    //             <div className="text-zinc-400">Проверка доступа к админке...</div>
    //         </div>
    //     );
    // }

    // Если пользователь авторизован
    return (
        <div className="flex min-h-screen bg-zinc-950">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}