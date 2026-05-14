// app/admin/dashboard/page.tsx
"use client";

import { Package} from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useAdminProducts } from "@/features/admin/hooks/useAdminProducts";

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { products } = useAdminProducts();

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Заголовок */}
            <div className="mb-8 sm:mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    Добро пожаловать, {user?.name}
                </h1>
            </div>

            {/* Быстрые действия */}
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
                    Быстрые действия
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <a
                        href="/admin/products"
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-6 sm:p-8 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold group-hover:text-blue-500 transition-colors">
                                    Управление товарами
                                </h3>
                                <p className="text-zinc-400 text-sm sm:text-base mt-1 leading-snug">
                                    Добавление, редактирование, удаление товаров
                                </p>
                            </div>
                        </div>
                    </a>

                    {/* Добавь остальные карточки сюда по аналогии */}
                </div>
            </div>

            {/* Последние товары */}
            <div>
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                        Последние добавленные товары
                    </h2>
                    <a
                        href="/admin/products"
                        className="text-blue-500 hover:text-blue-400 text-sm font-medium whitespace-nowrap"
                    >
                        Все товары →
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.slice(0, 8).map((product) => (
                        <div
                            key={product.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all"
                        >
                            {/* Изображение */}
                            <div className="relative h-40 sm:h-48 bg-zinc-950 flex items-center justify-center">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-zinc-600">
                                        <img
                                            src="/placeholder.svg"
                                            alt="Нет фото"
                                            className="w-12 h-12 sm:w-16 sm:h-16 opacity-40"
                                        />
                                        <p className="text-xs mt-2">Нет фото</p>
                                    </div>
                                )}
                            </div>

                            {/* Информация */}
                            <div className="p-4">
                                <h4 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-zinc-500 mt-1">{product.brand}</p>
                                <p className="text-base sm:text-lg font-semibold mt-3">
                                    {product.price.toLocaleString("ru-RU")} ₽
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}