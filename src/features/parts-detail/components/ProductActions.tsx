"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { Product } from "@/src/types";
import { useState } from "react";
import CartDrawer from "@/src/features/Navbar/components/cart/CartModal";

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const { addItem, updateQuantity, getItemQuantity, removeItem } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const quantityInCart = getItemQuantity(product.id);
    const isProductInCart = quantityInCart > 0;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: product.price,
            image: product.images?.[0] || "/images/placeholder.svg",
            stock: product.stock,
        });
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(product.id);
            return;
        }
        updateQuantity(product.id, newQuantity);
    };

    return (
        <div className="space-y-4 pt-2">
            {isProductInCart ? (
                /* Счётчик количества */
                <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-2">
                    <button
                        onClick={() => handleQuantityChange(quantityInCart - 1)}
                        className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    <span className="font-semibold text-2xl text-white min-w-[3rem] text-center">
                        {quantityInCart}
                    </span>

                    <button
                        onClick={() => handleQuantityChange(quantityInCart + 1)}
                        disabled={quantityInCart >= product.stock}
                        className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                /* Кнопка "Добавить в корзину" — однотонная с неоновым свечением */
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className=" btn-neon w-full py-4
               rounded-2xl font-semibold text-lg transition-all active:scale-[0.985]
              "
                >
                    <div className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-6 h-6" />
                        {product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
                    </div>
                </button>
            )}

            {/* Кнопка "Перейти в корзину" */}
            {isProductInCart && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full py-4 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black
                               rounded-2xl font-semibold text-lg transition-all active:scale-[0.985]"
                >
                    Перейти в корзину ({quantityInCart})
                </button>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}