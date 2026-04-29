// src/features/Navbar/components/cart/CartModal.tsx
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
        clearCart();                    // Очищаем корзину
        setIsOrderModalOpen(false);     // Закрываем OrderModal
        onClose();                      // Закрываем CartModal
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-6">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />

            <div
                className="bg-zinc-900 rounded-3xl w-full max-w-lg md:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold">Корзина</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Список товаров */}
                <div className="flex-1 overflow-auto p-5 sm:p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-16">
                            <div className="text-7xl mb-6 opacity-50">
                                <ShoppingCart className="w-16 h-16" />
                            </div>
                            <p className="text-2xl font-medium text-zinc-400">Корзина пуста</p>
                            <p className="text-zinc-500 mt-3">Добавьте товары из каталога</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
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

            {/* OrderModal */}
            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                redirectAfterSuccess={false}
                onSuccess={handleOrderSuccess}
            />
        </div>
    );
}