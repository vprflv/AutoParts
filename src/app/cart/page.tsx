"use client";

import { useCartStore } from "@/src/store/useCartStore";
import CartItem from "@/src/features/Navbar/components/cart/CartItem";
import CartFooter from "@/src/features/Navbar/components/cart/CartFooter";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderModal from "@/src/features/order/components/OrderModal";

export default function CartPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-950 pb-12 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
                {/* Заголовок */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-zinc-400 hover:text-white transition active:scale-90 p-2 -ml-2"
                    >
                        <ArrowLeft size={26} className="sm:size-7" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold">Корзина</h1>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 sm:py-32">
                        <div className="text-6xl sm:text-7xl mb-6 opacity-40">🛒</div>
                        <p className="text-2xl sm:text-3xl font-medium text-zinc-400">
                            Корзина пуста
                        </p>
                        <p className="text-zinc-500 mt-3 text-base sm:text-lg">
                            Добавьте товары из каталога
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5 sm:space-y-6">
                        {items.map((item, index) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                isLast={index === items.length - 1}
                            />
                        ))}

                        <CartFooter
                            clearCart={clearCart}
                            onOrderClick={() => setIsOrderModalOpen(true)}
                        />
                    </div>
                )}
            </div>

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                redirectAfterSuccess={true}
            />
        </div>
    );
}