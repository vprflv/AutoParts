'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product } from '@/types';
import ProductActions from "@/src/features/parts-detail/components/ProductActions";
import ImageThumbnails from "@/features/parts-detail/components/ImageThumbnails";


interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [activeTab, setActiveTab] = useState<"description" | "applicability">("description");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images?.filter(Boolean) || [];
    const currentImage = images[currentImageIndex] || '/images/placeholder.svg';

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

    const applicabilityArray = Array.isArray(product.applicability)
        ? product.applicability
        : product.applicability ? [product.applicability] : [];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
            <div className="bg-zinc-900 w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl relative flex flex-col">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">

                    {/* === ЛЕВАЯ ЧАСТЬ — ГАЛЕРЕЯ === */}
                    <div className="lg:w-1/2 bg-zinc-950 p-8 flex flex-col">
                        {/* Большое фото */}
                        <div className="relative flex-1 min-h-[300px] rounded-3xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {/* Миниатюры */}
                        <div className="mt-6">
                            <ImageThumbnails
                                images={images}
                                selectedIndex={currentImageIndex}
                                onSelect={setCurrentImageIndex}
                            />
                        </div>
                    </div>

                    {/* === ПРАВАЯ ЧАСТЬ — ИНФОРМАЦИЯ === */}
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
                    </div>
                </div>
            </div>
        </div>
    );
}