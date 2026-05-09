"use client";

import { useCartStore } from "@/src/store/useCartStore";
import { Trash2, Minus, Plus } from "lucide-react";

interface CartItemProps {
    item: any;
    isLast: boolean;
}

export default function CartItem({ item, isLast }: CartItemProps) {
    const { removeItem, updateQuantity } = useCartStore();
    const isOutOfStock = item.stock <= 0;

    const handleQuantityChange = (newQuantity: number) => {
        if (isOutOfStock) return;
        updateQuantity(item.id, newQuantity);
    };

    return (
        <div className={`flex gap-4 sm:gap-5 bg-zinc-900 rounded-2xl p-4 sm:p-5 ${!isLast ? 'border-b border-zinc-800' : ''}`}>
            {/* Изображение */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-4xl">
                        📦
                    </div>
                )}
            </div>

            {/* Основная информация */}
            <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight text-base sm:text-lg">{item.name}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{item.oem}</p>

                {/* Статус наличия */}
                {isOutOfStock ? (
                    <p className="text-red-500 text-sm font-medium mt-2">Нет в наличии</p>
                ) : (
                    <p className="text-emerald-500 text-sm mt-2">В наличии: {item.stock} шт.</p>
                )}

                {/* Цена + Количество — адаптивно */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                    {/* Цена */}
                    <div className="text-2xl sm:text-3xl font-semibold text-white">
                        {item.price.toLocaleString("ru-RU")} ₽
                    </div>

                    {/* Контроль количества */}
                    {isOutOfStock ? (
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 p-2 transition-all active:scale-90 self-end"
                        >
                            <Trash2 size={24} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-3 py-2 self-start">
                            <button
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                className="p-2 hover:bg-zinc-700 rounded-lg transition active:scale-90"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-8 text-center font-medium text-base">{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                className="p-2 hover:bg-zinc-700 rounded-lg transition active:scale-90"
                                disabled={item.quantity >= item.stock}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}