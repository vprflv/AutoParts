"use client";

import { useCartStore } from "@/src/store/useCartStore";

interface CartFooterProps {
    clearCart: () => void;
    onOrderClick: () => void;
}

export default function CartFooter({ clearCart, onOrderClick }: CartFooterProps) {
    const { totalPrice } = useCartStore();

    return (
        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
            {/* Сумма */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-400 text-lg">Итого</span>
                <span className="text-3xl font-bold tracking-tighter text-white">
                    {totalPrice().toLocaleString("ru-RU")} ₽
                </span>
            </div>

            {/* Главная кнопка — Оформить заказ */}
            <button
                onClick={onOrderClick}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500
                           py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.97]
                           shadow-neon-purple hover:shadow-[0_0_25px_#c026d3]"
            >
                Оформить заказ
            </button>

            {/* Очистить корзину */}
            <button
                onClick={clearCart}
                className="w-full mt-4 py-3.5 text-sm text-zinc-400 hover:text-red-400
                           hover:bg-zinc-900 rounded-2xl transition-all"
            >
                Очистить корзину
            </button>
        </div>
    );
}