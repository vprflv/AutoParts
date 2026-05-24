// src/features/admin/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import {useQueryClient} from "@tanstack/react-query";
import {useAdminStore} from "@/store/useAdminStore";


const menuItems = [
    { href: "/admin/dashboard", label: "Дашборд", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товары", icon: Package },
];

interface AdminSidebarProps {
    onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { adminUser } = useAdminStore();

    const handleLogout = async () => {
        const supabase = createClient();

        await supabase.auth.signOut({ scope: 'global' });

        // Полная очистка
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name.startsWith("sb-")) {
                document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            }
        });

        window.location.href = "/"; // жёсткий редирект
    };

    return (
        <div className="w-72 bg-zinc-900 border-r border-zinc-800 h-full flex flex-col">
            {/* Заголовок + кнопка закрытия на мобильных */}
            <div className="p-6 flex items-center justify-between lg:justify-start">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="text-zinc-500 text-sm">AutoPart Pro</p>
                </div>
                {/* Кнопка выхода */}
                <div className="p-3 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 rounded-2xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Выйти</span>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-zinc-800 rounded-xl"
                >
                    <X className="w-6 h-6 text-zinc-400" />
                </button>
            </div>

            {/* Информация об администраторе */}
            <div className="px-6 mb-8">
                <p className="text-xs text-zinc-500 mb-2">АДМИНИСТРАТОР</p>
                <p className="font-medium">{adminUser?.name}</p>
                <p className="text-sm text-zinc-500 truncate">{adminUser?.email}</p>
            </div>

            {/* Навигация */}
            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-zinc-800 text-zinc-300"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>


        </div>
    );
}