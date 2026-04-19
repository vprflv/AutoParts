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
        });
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(product.id);
            return;
        }
        updateQuantity(product.id, newQuantity);
    };

    // Если товара нет в наличии вообще
    if (product.stock === 0) {
        return (
            <Link href={`/products/${product.id}`} className="group block">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full opacity-75">
                    {/* Изображение */}
                    <div className="relative h-64 bg-zinc-950 overflow-hidden">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Контент */}
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex-1">
                            <p className="text-sm text-zinc-500">{product.brand} • {product.category}</p>
                            <h3 className="font-semibold text-lg leading-tight mt-2 line-clamp-3">
                                {product.name}
                            </h3>
                            <p className="text-sm text-red-500 mt-2">OEM: {product.oem}</p>
                        </div>

                        <div className="mt-auto pt-6">
                            <p className="text-3xl font-bold text-white mb-4">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>

                            <p className="text-sm text-red-500 mb-6">В наличии: 0 шт.</p>

                            <button
                                disabled
                                className="w-full py-4 rounded-2xl font-semibold bg-zinc-700 text-zinc-400 cursor-not-allowed"
                            >
                                Товар закончился
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-600 transition-all duration-300 hover:shadow-2xl flex flex-col h-full">

                {/* Изображение */}
                <div className="relative h-64 bg-zinc-950 overflow-hidden">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Контент */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <p className="text-sm text-zinc-500">{product.brand} • {product.category}</p>
                        <h3 className="font-semibold text-lg leading-tight mt-2 line-clamp-3">
                            {product.name}
                        </h3>
                        <p className="text-sm text-red-500 mt-2">OEM: {product.oem}</p>
                    </div>

                    <div className="mt-auto pt-6">
                        <p className="text-3xl font-bold text-white mb-4">
                            {product.price.toLocaleString("ru-RU")} ₽
                        </p>

                        <p className="text-sm text-emerald-500 mb-6">
                            В наличии: {product.stock} шт.
                        </p>

                        {isProductInCart ? (
                            <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-1">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleQuantityChange(quantityInCart - 1);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>

                                <span className="font-semibold text-lg min-w-[2rem] text-center">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleQuantityChange(quantityInCart + 1);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"
                                    disabled={quantityInCart >= product.stock}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.985]"
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