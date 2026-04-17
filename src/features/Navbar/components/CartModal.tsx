"use client";

import Image from "next/image";
import {Trash2, Plus, Minus, X, ShoppingCart} from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">

            <div className="fixed inset-0 bg-black/70" onClick={onClose} />

            {/* modal*/}
            <div
                className="bg-zinc-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Корзина</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* cartInside */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-16">
                            <div className="text-7xl mb-6"><ShoppingCart className="w-10 h-10" /></div>
                            <p className="text-2xl font-medium text-zinc-400">Корзина пуста</p>
                            <p className="text-zinc-500 mt-2">Добавьте товары из каталога</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-5 bg-zinc-800 p-5 rounded-2xl">
                                <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium leading-tight line-clamp-2">{item.name}</p>
                                    <p className="text-xl font-semibold mt-3">
                                        {item.price.toLocaleString("ru-RU")} ₽
                                    </p>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center border border-zinc-700 rounded-xl">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-4 py-2 hover:bg-zinc-800 rounded-l-xl transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-6 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-4 py-2 hover:bg-zinc-800 rounded-r-xl transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-600 p-2 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* End*/}
                {items.length > 0 && (
                    <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                        <div className="flex justify-between items-center text-2xl font-semibold mb-6">
                            <span>Итого</span>
                            <span>{totalPrice().toLocaleString("ru-RU")} ₽</span>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg transition-colors">
                            Оформить заказ
                        </button>

                        <button
                            onClick={clearCart}
                            className="w-full mt-4 text-zinc-400 hover:text-white py-3 text-sm"
                        >
                            Очистить корзину
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}