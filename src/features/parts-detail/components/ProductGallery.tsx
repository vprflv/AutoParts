// src/features/product-detail/components/ProductGallery.tsx
"use client";

import Image from "next/image";
import {ChevronLeft, ChevronRight, Expand, X} from "lucide-react";
import { useState } from "react";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const goToPrevious = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <>
            <div className="bg-zinc-900 rounded-3xl overflow-hidden relative group">
                <Image
                    src={images[selectedImageIndex]}
                    alt="Фото товара"
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain"
                    priority
                />

                {/* Стрелки на главном фото */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Кнопка открытия галереи */}
                {images.length > 1 && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-6 right-6 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all shadow-lg"
                    >
                        <Expand className="w-4 h-4" />
                        Открыть галерею
                    </button>
                )}
            </div>

            {/* Миниатюры */}
            {images.length > 1 && (
                <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                                selectedImageIndex === index
                                    ? "border-blue-600"
                                    : "border-transparent hover:border-zinc-600"
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Фото ${index + 1}`}
                                width={120}
                                height={80}
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white hover:text-zinc-300"
                    >
                        <X size={40} />
                    </button>

                    <div className="relative w-full max-w-5xl px-6">
                        <Image
                            src={images[selectedImageIndex]}
                            alt="Фото товара"
                            width={1400}
                            height={1000}
                            className="max-h-[88vh] object-contain mx-auto"
                        />
                    </div>
                </div>
            )}
        </>
    );
}