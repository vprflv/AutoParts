"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import Link from "next/link";
import { Product } from "@/src/types";
import { useState } from "react";
import { getFreshImageUrl } from "@/src/lib/utils/image";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, updateQuantity, getItemQuantity, removeItem } = useCartStore();

    const quantityInCart = getItemQuantity(product.id);
    const isProductInCart = quantityInCart > 0;

    const [imageError, setImageError] = useState(false);

    const rawImage = product.images?.[0];
    const imageSrc = product.images?.[0] && !imageError
        ? getFreshImageUrl(rawImage)
        : "/images/placeholder.svg";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: product.price,
            image: imageSrc,
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

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-cyan-200 transition-all duration-300 hover:shadow-neon-main flex flex-col h-full">

                {/* Изображение */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-red-500 font-medium px-4 py-1.5 bg-red-950/80 rounded-full text-sm">
                                Нет в наличии
                            </span>
                        </div>
                    )}
                </div>

                {/* Контент */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm text-zinc-500">
                            {product.brand} • {product.category}
                        </p>
                        <h3 className="font-semibold text-base sm:text-lg leading-tight mt-2 line-clamp-3 group-hover:text-cyan-300 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-blue-400  mt-3"> <span className="text-white" >OEM</span>: {product.oem}</p>
                    </div>

                    <div className="mt-auto pt-6">
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            {product.price.toLocaleString("ru-RU")} ₽
                        </p>

                        {product.stock > 0 ? (
                            <p className="text-sm text-emerald-500 mb-6">
                                В наличии: {product.stock} шт.
                            </p>
                        ) : (
                            <p className="text-sm text-red-500 mb-6">Нет в наличии</p>
                        )}

                        {/* Кнопки */}
                        {isProductInCart ? (
                            <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-1.5">
                                <button
                                    onClick={(e) => { e.preventDefault(); handleQuantityChange(quantityInCart - 1); }}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-700 rounded-xl transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>

                                <span className="font-semibold text-cyan-300 text-lg min-w-[2.5rem] text-center">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={(e) => { e.preventDefault(); handleQuantityChange(quantityInCart + 1); }}
                                    disabled={quantityInCart >= product.stock}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full flex items-center justify-center gap-3 btn-neon  rounded-2xl font-semibold text-base transition-all active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed "
                            >


                                <ShoppingCart className="w-5 h-5" />
                                В корзину
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}