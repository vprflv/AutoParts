// features/catalog/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import ProductModal from './ProductModal';
import { useCartStore } from '@/src/store/useCartStore';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addItem, updateQuantity, removeItem, getItemQuantity } = useCartStore();

    const quantityInCart = getItemQuantity(product.id);
    const isInCart = quantityInCart > 0;

    const imageSrc = product.images?.[0]
        ? product.images[0]
        : '/images/placeholder.svg';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: Number(product.price),
            image: imageSrc,
            stock: product.stock,
        });
    };

    const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
        e.stopPropagation();
        if (newQuantity < 1) {
            removeItem(product.id);
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 active:scale-[0.98] group h-full flex flex-col cursor-pointer"
            >
                {/* Изображение */}
                <div className="relative h-52 bg-zinc-950 flex-shrink-0">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="bg-red-950 text-red-400 text-xs px-4 py-1.5 rounded-full">Нет в наличии</span>
                        </div>
                    )}
                </div>

                {/* Контент */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-cyan-400 font-mono text-sm mb-4">{product.oem}</p>

                    <div className="mt-auto">
                        <p className="text-2xl font-bold mb-1">
                            {Number(product.price).toLocaleString('ru-RU')} ₽
                        </p>

                        <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {product.stock > 0 ? `В наличии • ${product.stock} шт.` : 'Под заказ'}
                        </p>

                        {/* Управление корзиной */}
                        {isInCart ? (
                            <div className="flex items-center bg-zinc-800 rounded-2xl p-1">
                                <button
                                    onClick={(e) => handleQuantityChange(e, quantityInCart - 1)}
                                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>

                                <span className="flex-1 text-center font-semibold text-cyan-300">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={(e) => handleQuantityChange(e, quantityInCart + 1)}
                                    disabled={quantityInCart >= product.stock}
                                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-zinc-700 text-black font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.985]"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                В корзину
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}