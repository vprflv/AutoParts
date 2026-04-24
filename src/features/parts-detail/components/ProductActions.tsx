
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
            image: product.images[0],
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
        <div className="space-y-3 pt-2">
            {isProductInCart ? (
                <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-2.5">
                    <button
                        onClick={() => handleQuantityChange(quantityInCart - 1)}
                        className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 active:bg-zinc-700"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    <span className="font-semibold text-xl min-w-[3rem] text-center">
                        {quantityInCart}
                    </span>

                    <button
                        onClick={() => handleQuantityChange(quantityInCart + 1)}
                        disabled={quantityInCart >= product.stock}
                        className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 active:bg-zinc-700 disabled:opacity-50"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 rounded-2xl font-semibold text-base sm:text-lg transition-all active:scale-[0.985]"
                >
                    <div className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-5 h-5" />
                        {product.stock === 0 ? "Товар закончился" : "Добавить в корзину"}
                    </div>
                </button>
            )}

            {isProductInCart && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl font-semibold text-base sm:text-lg transition-all"
                >
                    Перейти в корзину ({quantityInCart})
                </button>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}