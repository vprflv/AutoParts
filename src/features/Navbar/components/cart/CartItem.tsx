// src/features/Navbar/components/CartItem.tsx
"use client";

import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";

interface CartItemProps {
    item: any;
    isLast: boolean;
}

export default function CartItem({ item, isLast }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className={`pb-6 ${!isLast ? 'border-b border-zinc-800' : ''}`}>
            <div className="flex flex-col sm:flex-row gap-4 bg-zinc-800 p-5 rounded-2xl">
                {/* Фото */}
                <div className="w-full sm:w-28 h-40 sm:h-28 relative rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <p className="font-medium leading-tight line-clamp-2 text-base">
                        {item.name}
                    </p>
                    <p className="text-xl font-semibold mt-2">
                        {item.price.toLocaleString("ru-RU")} ₽
                    </p>

                    {/* Количество и удаление */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-zinc-700 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-4 py-2.5 hover:bg-zinc-700 active:bg-zinc-600 transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 font-medium text-lg">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-4 py-2.5 hover:bg-zinc-700 active:bg-zinc-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Иконка удаления на больших экранах */}
                        <button
                            onClick={() => removeItem(item.id)}
                            className="hidden sm:block text-red-500 hover:text-red-600 p-2 transition-colors"
                        >
                            <Trash2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Кнопка "Удалить товар" только на мобильных */}
            <button
                onClick={() => removeItem(item.id)}
                className="sm:hidden w-full mt-3 text-red-500 hover:text-red-600 py-2 text-sm font-medium transition-colors"
            >
                Удалить товар
            </button>
        </div>
    );
}