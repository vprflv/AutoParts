// src/app/admin/layout.tsx  (или app/admin/layout.tsx)
"use client";

import { useState } from "react";
import AdminMobileHeader from "@/features/admin/components/AdminMobileHeader";
import AdminSidebar from "@/features/admin/components/AdminSidebar";


export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* Боковая панель — скрывается на мобильных */}
            <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300`}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Основное содержание */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Мобильный хедер с бургером */}
                <AdminMobileHeader
                    onBurgerClick={() => setSidebarOpen(true)}
                />

                {/* Контент */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Затемнение при открытом меню на мобильных */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}