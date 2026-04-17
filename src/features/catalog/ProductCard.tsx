"use client";

import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import Link from "next/link";
import {Product} from "@/src/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // предотвращаем переход по ссылке при клике на кнопку
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: product.price,
            image: product.images[0], // первое фото для корзины
        });
    };

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-600 transition-all duration-300 hover:shadow-2xl flex flex-col h-full">

                {/* Изображение */}
                <div className="relative h-64 bg-zinc-950 overflow-hidden">
                    <Image
                        src={product.images[0]}           // показываем первое фото
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Мало в наличии
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Нет в наличии
                        </div>
                    )}
                </div>

                {/* Контент карточки */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1">
                            <p className="text-sm text-zinc-500">{product.brand} • {product.category}</p>
                            <h3 className="font-semibold text-lg leading-tight mt-2 line-clamp-3">
                                {product.name}
                            </h3>
                            <p className="text-sm text-red-500 mt-2">OEM: {product.oem}</p>
                        </div>
                        <button
                            onClick={(e) => e.preventDefault()} // предотвращаем переход по ссылке
                            className="text-zinc-400 hover:text-red-500 transition-colors mt-1"
                        >
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Цена и наличие */}
                    <div className="mt-auto">
                        <div className="flex items-baseline justify-between mb-6">
                            <p className="text-3xl font-bold text-white tracking-tight">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>

                        <p className="text-xs text-emerald-500 mb-6">
                            В наличии: {product.stock} шт.
                        </p>

                        {/* Кнопка "В корзину" */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.985]"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}