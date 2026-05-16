"use client";

import { X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import CartItem from "@/src/features/Navbar/components/cart/CartItem";
import CartFooter from "@/src/features/Navbar/components/cart/CartFooter";
import { useState } from "react";
import OrderModal from "@/src/features/order/components/OrderModal";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, clearCart } = useCartStore();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    if (!isOpen) return null;

    const handleOrderSuccess = () => {
        clearCart();
        setIsOrderModalOpen(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-6">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />

            <div
                className="bg-zinc-900 rounded-3xl w-full max-w-lg md:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col relative z-10 border border-zinc-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-3">
                        {/* Иконка корзины с лёгким контуром */}
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors">
                            <ShoppingCart className="w-5 h-5 text-cyan-300" />
                        </div>
                        {/*<h2 className="text-2xl font-semibold text-purple-500/80 tracking-tight">Корзина</h2>*/}
                    </div>

                    {/* Кнопка закрытия с ярким неоновым свечением */}
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl text-zinc-400 hover:text-white transition-all duration-200
                    "
                    >
                        <X size={28} className="text-cyan-300 hover:text-blue-500  "  />
                    </button>
                </div>

                {/* Список товаров — без видимого скроллбара */}
                <div className="flex-1 overflow-auto custom-scroll-purple p-6 custom-scroll-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-16">
                            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                                <ShoppingCart className="w-10 h-10 text-zinc-500" />
                            </div>
                            <p className="text-2xl font-medium text-zinc-400">Корзина пуста</p>
                            <p className="text-zinc-500 mt-3 max-w-xs">
                                Добавьте товары из каталога, чтобы увидеть их здесь
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {items.map((item, index) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    isLast={index === items.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Футер */}
                {items.length > 0 && (
                    <CartFooter
                        clearCart={clearCart}
                        onOrderClick={() => setIsOrderModalOpen(true)}
                    />
                )}
            </div>

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                redirectAfterSuccess={false}
                onSuccess={handleOrderSuccess}
            />
        </div>
    );
}