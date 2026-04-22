// app/admin/dashboard/page.tsx
"use client";

import { Package, Users, MessageSquare, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { products as allProducts } from "@/src/lib/mockData";

export default function AdminDashboard() {
    const { user } = useAuthStore();

    // Подсчёт статистики
    const totalProducts = allProducts.length;
    const inStockProducts = allProducts.filter(p => p.stock > 0).length;
    const outOfStockProducts = allProducts.filter(p => p.stock === 0).length;

    // Симуляция количества заявок и заказов (пока на моках)
    const totalFeedbacks = 28;
    const totalOrders = 67;

    const stats = [
        {
            title: "Всего товаров",
            value: totalProducts,
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "В наличии",
            value: inStockProducts,
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Заявки",
            value: totalFeedbacks,
            icon: MessageSquare,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            title: "Заказы",
            value: totalOrders,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-white">Добро пожаловать, {user?.name}</h1>
                <p className="text-zinc-400 mt-2">Вот что происходит в твоём магазине сегодня</p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                            <div className={`inline-flex p-3 rounded-2xl ${stat.bg} mb-4`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-zinc-400">{stat.title}</div>
                        </div>
                    );
                })}
            </div>

            {/* Быстрые действия */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                        href="/admin/products"
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-8 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                                <Package className="w-7 h-7 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">
                                    Управление товарами
                                </h3>
                                <p className="text-zinc-400 mt-1">Добавление, редактирование, удаление товаров</p>
                            </div>
                        </div>
                    </a>

                    <a
                        href="/admin/feedback"
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-8 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="w-7 h-7 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold group-hover:text-amber-500 transition-colors">
                                    Просмотр заявок
                                </h3>
                                <p className="text-zinc-400 mt-1">Заявки от клиентов на подбор запчастей</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Последние товары */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Последние добавленные товары</h2>
                    <a href="/admin/products" className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                        Все товары →
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allProducts.slice(0, 8).map((product) => (
                        <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                            <div className="relative h-48 bg-zinc-950">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h4 className="font-medium line-clamp-2 text-sm">{product.name}</h4>
                                <p className="text-xs text-zinc-500 mt-1">{product.brand}</p>
                                <p className="text-lg font-semibold mt-3">{product.price.toLocaleString("ru-RU")} ₽</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}