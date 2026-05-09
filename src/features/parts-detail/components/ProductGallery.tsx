"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useState } from "react";
import ImageThumbnails from "./ImageThumbnails";
import { getFreshImageUrl } from "@/src/lib/utils/image";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Свайп логика (универсальная)
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const goToPrevious = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    // Обработка свайпа
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;

        if (distance > 50) goToNext();
        if (distance < -50) goToPrevious();

        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <>
            {/* Главная галерея */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden relative border border-zinc-800 group">
                <div
                    className="relative aspect-square md:aspect-[16/13] bg-zinc-950 touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        src={getFreshImageUrl(images[selectedImageIndex])}
                        alt="Фото товара"
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                </div>

                {/* Стрелки навигации */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-400/30 p-3 rounded-full text-white transition-all z-10 hover:scale-110 hover:shadow-[0_0_15px_#22d3ee]"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-400/30 p-3 rounded-full text-white transition-all z-10 hover:scale-110 hover:shadow-[0_0_15px_#22d3ee]"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {images.length > 1 && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-5 right-5 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all hover:shadow-neon-main"
                    >
                        <Expand className="w-4 h-4" />
                        Увеличить
                    </button>
                )}
            </div>

            {/* Миниатюры */}
            <ImageThumbnails
                images={images}
                selectedIndex={selectedImageIndex}
                onSelect={setSelectedImageIndex}
            />

            {/* ==================== Lightbox ==================== */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-cyan-300 hover:text-white p-3 transition-colors z-30"
                    >
                        <X size={36} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-4 rounded-full text-white z-20 transition-all hover:scale-110"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-4 rounded-full text-white z-20 transition-all hover:scale-110"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Lightbox изображение с свайпом */}
                    <div
                        className="relative w-full max-w-5xl px-4 flex flex-col items-center touch-pan-y"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={getFreshImageUrl(images[selectedImageIndex])}
                            alt="Фото товара"
                            width={1400}
                            height={1000}
                            className="max-h-[85vh] object-contain"
                        />

                        {images.length > 1 && (
                            <div className="mt-8 w-full flex justify-center">
                                <div className="max-w-[700px] w-full">
                                    <ImageThumbnails
                                        images={images}
                                        selectedIndex={selectedImageIndex}
                                        onSelect={setSelectedImageIndex}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}