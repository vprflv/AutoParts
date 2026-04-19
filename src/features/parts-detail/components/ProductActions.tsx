
"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { Product } from "@/src/types";
import { useState } from "react";
import CartDrawer from "@/src/features/Navbar/components/CartModal";

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
        <div className="pt-4 space-y-3">
            {isProductInCart ? (
                <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-2">
                    <button
                        onClick={() => handleQuantityChange(quantityInCart - 1)}
                        className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                        <Minus className="w-6 h-6" />
                    </button>

                    <span className="font-semibold text-2xl">{quantityInCart}</span>

                    <button
                        onClick={() => handleQuantityChange(quantityInCart + 1)}
                        className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700 transition-colors"
                        disabled={quantityInCart >= product.stock}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 py-5 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985]"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {product.stock === 0 ? "Товар закончился" : "Добавить в корзину"}
                </button>
            )}

            {isProductInCart && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-5 rounded-2xl font-semibold text-lg transition-all"
                >
                    <ShoppingCart className="w-6 h-6" />
                    Перейти в корзину ({quantityInCart})
                </button>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}