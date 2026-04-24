"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import Link from "next/link";
import { Product } from "@/src/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, updateQuantity, getItemQuantity, removeItem } = useCartStore();

    const quantityInCart = getItemQuantity(product.id);
    const isProductInCart = quantityInCart > 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: product.price,
            image: product.images[0],
            stock: product.stock
        });
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(product.id);
            return;
        }
        updateQuantity(product.id, newQuantity);
    };

    if (product.stock === 0) {
        return (
            <Link href={`/products/${product.id}`} className="group block h-full">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full opacity-75 hover:opacity-90 transition-all">
                    {/* Изображение */}
                    <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Контент */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm text-zinc-500">
                                {product.brand} • {product.category}
                            </p>
                            <h3 className="font-semibold text-base sm:text-lg leading-tight mt-2 line-clamp-3">
                                {product.name}
                            </h3>
                            <p className="text-xs text-red-500 mt-3">OEM: {product.oem}</p>
                        </div>

                        <div className="mt-auto pt-6">
                            <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className="text-sm text-red-500 mb-6">Нет в наличии</p>

                            <button
                                disabled
                                className="w-full py-3.5 sm:py-4 rounded-2xl font-semibold bg-zinc-700 text-zinc-400 cursor-not-allowed text-sm sm:text-base"
                            >
                                Товар закончился
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Основная карточка (товар в наличии)
    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-600 transition-all duration-300 hover:shadow-2xl flex flex-col h-full">

                {/* Изображение */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Контент */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm text-zinc-500">
                            {product.brand} • {product.category}
                        </p>
                        <h3 className="font-semibold text-base sm:text-lg leading-tight mt-2 line-clamp-3">
                            {product.name}
                        </h3>
                        <p className="text-xs text-red-500 mt-3">OEM: {product.oem}</p>
                    </div>

                    <div className="mt-auto pt-6">
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            {product.price.toLocaleString("ru-RU")} ₽
                        </p>

                        <p className="text-sm text-emerald-500 mb-6">
                            В наличии: {product.stock} шт.
                        </p>

                        {isProductInCart ? (
                            <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-1.5 sm:p-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleQuantityChange(quantityInCart - 1);
                                    }}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-700 rounded-xl transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>

                                <span className="font-semibold text-lg min-w-[2.5rem] text-center">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleQuantityChange(quantityInCart + 1);
                                    }}
                                    disabled={quantityInCart >= product.stock}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all active:scale-[0.985]"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Добавить в корзину
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}