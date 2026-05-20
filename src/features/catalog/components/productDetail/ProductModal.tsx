// features/catalog/components/ProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product } from '@/types';
import ProductActions from "@/src/features/parts-detail/components/ProductActions";

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [activeTab, setActiveTab] = useState<"description" | "applicability">("description");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Галерея
    const images = product.images?.length > 0
        ? product.images
        : ['/images/placeholder.svg'];

    const currentImage = images[currentImageIndex];

    // Закрытие по Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    // Приводим applicability к массиву
    const applicabilityArray = Array.isArray(product.applicability)
        ? product.applicability
        : product.applicability ? [product.applicability] : [];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
            <div className="bg-zinc-900 w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl relative flex flex-col">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">

                    {/* Галерея */}
                    <div className="lg:w-1/2 bg-zinc-950 p-8 flex flex-col">
                        <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-zinc-950">
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-contain p-6"
                                priority
                            />
                        </div>

                        {/* Миниатюры */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-6 justify-center">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            index === currentImageIndex
                                                ? 'border-cyan-400 scale-110'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Фото ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Информация о товаре */}
                    <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
                        <div className="mb-6">
                            <p className="text-cyan-400 font-mono text-sm">{product.oem}</p>
                            <h1 className="text-3xl font-bold mt-2 leading-tight">{product.name}</h1>
                            <p className="text-zinc-400 mt-1">{product.brand}</p>
                        </div>

                        {/* Цена и наличие */}
                        <div className="flex items-end gap-4 mb-8">
                            <p className="text-4xl font-bold">
                                {Number(product.price).toLocaleString('ru-RU')} ₽
                            </p>
                            <p className={`text-lg ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `В наличии • ${product.stock} шт.` : 'Под заказ'}
                            </p>
                        </div>

                        <ProductActions product={product} />

                        {/* Табы */}
                        <div className="mt-10 border-b border-zinc-800 flex">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-8 py-4 font-medium transition-all border-b-2 ${
                                    activeTab === "description" ? "border-cyan-400 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Описание
                            </button>
                            <button
                                onClick={() => setActiveTab("applicability")}
                                className={`px-8 py-4 font-medium transition-all border-b-2 ${
                                    activeTab === "applicability" ? "border-cyan-400 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Применяемость
                            </button>
                        </div>

                        <div className="pt-8">
                            {activeTab === "description" && (
                                <div className="prose prose-invert text-zinc-300 leading-relaxed">
                                    {product.description || <p className="text-zinc-500 italic">Описание отсутствует</p>}
                                </div>
                            )}

                            {activeTab === "applicability" && (
                                <div className="flex flex-wrap gap-3">
                                    {applicabilityArray.length > 0 ? (
                                        applicabilityArray.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-zinc-800 border border-zinc-700 px-5 py-3 rounded-2xl text-sm"
                                            >
                                                {item}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-zinc-500 italic">Информация о применяемости отсутствует</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Характеристики */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mt-10">
                                <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">Характеристики</h3>
                                <div className="space-y-3 text-sm">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b border-zinc-800 pb-2">
                                            <span className="text-zinc-400">{key}</span>
                                            <span className="text-white text-right">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}