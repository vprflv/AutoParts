"use client";

import Image from "next/image";
import { getFreshImageUrl } from "@/src/lib/utils/image";
import { useState } from "react";

interface ImageThumbnailsProps {
    images: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export default function ImageThumbnails({
                                            images,
                                            selectedIndex,
                                            onSelect
                                        }: ImageThumbnailsProps) {

    const validImages = images.filter(img =>
        img && typeof img === "string" && img.trim() !== ""
    );

    if (validImages.length <= 1) return null;

    return (
        <div className="custom-scroll-purple flex gap-4 justify-center overflow-x-auto pb-4 pt-2 snap-x">
            {validImages.map((img, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(index)}
                    className={`flex-shrink-0 w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 relative
                        ${selectedIndex === index
                        ? "border-cyan-500 scale-110 shadow-lg"
                        : "border-transparent hover:border-zinc-600"
                    }`}
                >
                    <Image
                        src={getFreshImageUrl(img)}
                        alt={`Миниатюра ${index + 1}`}
                        width={120}
                        height={80}
                        className="object-cover w-full h-full"
                        loading="lazy"                    // ← важно
                        quality={75}                      // ← снижаем качество для миниатюр
                        onError={(e) => {
                            // Fallback при ошибке загрузки
                            e.currentTarget.src = "/images/placeholder.svg";
                        }}
                    />

                    {/* Лоадер при загрузке */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                </button>
            ))}
        </div>
    );
}