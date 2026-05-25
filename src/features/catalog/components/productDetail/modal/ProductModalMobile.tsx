'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product } from '@/types';
import ProductActions from "@/src/features/parts-detail/components/ProductActions";
import ImageThumbnails from "@/features/parts-detail/components/ImageThumbnails";

interface Props {
    product: Product;
    onClose: () => void;
}

export default function ProductModalMobile({ product, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<"description" | "applicability">("description");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images?.filter(Boolean) || [];
    const currentImage = images[currentImageIndex] || '/images/placeholder.svg';

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const applicabilityArray = Array.isArray(product.applicability)
        ? product.applicability
        : product.applicability ? [product.applicability] : [];

    // Обработка specifications
    const specifications = product.specifications
        ? (typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : product.specifications)
        : {};

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg p-3 pt-12">
            <div className="bg-zinc-900 w-full max-h-[94vh] rounded-3xl flex flex-col overflow-hidden relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-1 custom-scroll-purple">
                    {/* Галерея */}
                    <div className="bg-zinc-950 p-6">
                        <div className="relative aspect-square rounded-3xl overflow-hidden">
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="mt-6">
                                <ImageThumbnails
                                    images={images}
                                    selectedIndex={currentImageIndex}
                                    onSelect={setCurrentImageIndex}
                                />
                            </div>
                        )}
                    </div>

                    {/* Контент */}
                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-cyan-400 font-mono text-sm">{product.oem}</p>
                            <h1 className="text-2xl font-bold mt-2 leading-tight">{product.name}</h1>
                            <p className="text-zinc-400 mt-1">{product.brand}</p>
                        </div>

                        {/* === БЛОК ХАРАКТЕРИСТИК С ТОЧКАМИ === */}
                        {Object.keys(specifications).length > 0 && (
                            <div className="mb-8 space-y-3">
                                {Object.entries(specifications).map(([key, value]) => (
                                    <div key={key} className="flex items-baseline text-[15px]">
                                        <span className="text-zinc-400 whitespace-nowrap min-w-[130px]">
                                            {key}
                                        </span>
                                        <span className="flex-1 border-b border-dotted border-zinc-700 mx-3 relative -top-px"></span>
                                        <span className="text-white font-medium text-right whitespace-nowrap">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Цена и наличие */}
                        <div className="flex items-end gap-4 mb-8">
                            <p className="text-3xl font-bold">
                                {Number(product.price).toLocaleString('ru-RU')} ₽
                            </p>
                            <p className={`text-base ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `В наличии • ${product.stock} шт.` : 'Под заказ'}
                            </p>
                        </div>

                        <ProductActions product={product} />

                        {/* Табы */}
                        <div className="mt-8 border-b border-zinc-800 flex">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`flex-1 py-4 font-medium border-b-2 ${
                                    activeTab === "description" ? "border-cyan-400 text-white" : "border-transparent text-zinc-400"
                                }`}
                            >
                                Описание
                            </button>
                            <button
                                onClick={() => setActiveTab("applicability")}
                                className={`flex-1 py-4 font-medium border-b-2 ${
                                    activeTab === "applicability" ? "border-cyan-400 text-white" : "border-transparent text-zinc-400"
                                }`}
                            >
                                Применяемость
                            </button>
                        </div>

                        <div className="pt-8 pb-12">
                            {activeTab === "description" && (
                                <div className="prose prose-invert text-zinc-300 leading-relaxed">
                                    {product.description || <p className="text-zinc-500 italic">Описание отсутствует</p>}
                                </div>
                            )}

                            {activeTab === "applicability" && (
                                <div className="flex flex-wrap gap-3">
                                    {applicabilityArray.length > 0 ? (
                                        applicabilityArray.map((item, index) => (
                                            <div key={index} className="bg-zinc-800 border border-zinc-700 px-5 py-3 rounded-2xl text-sm">
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