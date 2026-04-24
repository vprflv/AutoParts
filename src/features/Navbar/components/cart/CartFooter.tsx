
"use client";

import {useCartStore} from "@/src/store/useCartStore";

interface CartFooterProps {
    clearCart: () => void;
    onOrderClick: () => void;
}

export default function CartFooter({ clearCart, onOrderClick }: CartFooterProps) {
    const { totalPrice } = useCartStore();   // можно вынести totalPrice в props, если хочешь

    return (
        <div className="p-5 sm:p-6 border-t border-zinc-800 bg-zinc-950">
            <div className="flex justify-between items-center text-2xl font-semibold mb-5">
                <span>Итого</span>
                <span>{totalPrice().toLocaleString("ru-RU")} ₽</span>
            </div>

            <button onClick={onOrderClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg transition-colors">
                Оформить заказ
            </button>

            <button
                onClick={clearCart}
                className="w-full mt-4 text-zinc-400 hover:text-white py-3 text-sm transition-colors"
            >
                Очистить корзину
            </button>
        </div>
    );
}