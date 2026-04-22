// src/features/admin/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, MessageSquare, ShoppingCart, LogOut } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

const menuItems = [
    { href: "/admin/dashboard", label: "Дашборд", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/feedback", label: "Заявки", icon: MessageSquare },
    { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    return (
        <div className="w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-zinc-500 text-sm mt-1">AutoPart Pro</p>
            </div>

            <div className="mb-8">
                <p className="text-xs text-zinc-500 mb-2">АДМИНИСТРАТОР</p>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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

            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 rounded-2xl transition-colors mt-auto"
            >
                <LogOut className="w-5 h-5" />
                <span>Выйти</span>
            </button>
        </div>
    );
}