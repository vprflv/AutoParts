"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useState } from "react";
import ImageThumbnails from "./ImageThumbnails";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Свайп логика
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const goToPrevious = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

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

        if (distance > 50 && selectedImageIndex < images.length - 1) goToNext();
        if (distance < -50 && selectedImageIndex > 0) goToPrevious();
    };

    return (
        <>
            {/* Главная галерея */}
            <div
                className="bg-zinc-900 rounded-3xl overflow-hidden relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative aspect-square md:aspect-[16/13]">
                    <Image
                        src={images[selectedImageIndex]}
                        alt="Фото товара"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Стрелки на главной галерее */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2.5 sm:p-3 rounded-full text-white transition-all z-10"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2.5 sm:p-3 rounded-full text-white transition-all z-10"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </>
                )}

                {/* Кнопка открытия галереи */}
                {images.length > 1 && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black/80 hover:bg-black text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all shadow-lg z-10"
                    >
                        <Expand className="w-4 h-4" />

                    </button>
                )}
            </div>

            {/* Миниатюры под основной галереей */}
            <ImageThumbnails
                images={images}
                selectedIndex={selectedImageIndex}
                onSelect={setSelectedImageIndex}
            />


            {/* ==================== Lightbox (полноэкранная) ==================== */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white hover:text-zinc-300 z-30"
                    >
                        <X size={36} />
                    </button>

                    {/* Стрелки */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/90 p-3 sm:p-4 rounded-full text-white z-20 transition-all "
                            >
                                <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/90 p-3 sm:p-4 rounded-full text-white z-20 transition-all"
                            >
                                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                        </>
                    )}

                    <div className="relative w-full max-w-5xl px-4 sm:px-6 flex flex-col items-center">
                        {/* Основное фото */}
                        <Image
                            src={images[selectedImageIndex]}
                            alt="Фото товара"
                            width={1400}
                            height={1000}
                            className="max-h-[78vh] sm:max-h-[82vh] md:max-h-[85vh] object-contain mx-auto"
                        />

                        {/* Миниатюры в lightbox */}
                        {images.length > 1 && (
                            <div className="mt-6 sm:mt-8 w-full flex justify-center px-4">
                                <div className="max-w-[680px] w-full">
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