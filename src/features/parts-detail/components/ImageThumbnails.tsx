"use client";

import Image from "next/image";

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
    if (images.length <= 1) return null;

    return (
        <div className="flex gap-4 justify-center overflow-x-auto pb-4 scrollbar-hide pt-2 snap-x">
            {images.map((img, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(index)}
                    className={`flex-shrink-0 w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200
                        ${selectedIndex === index
                        ? "border-blue-600 scale-110 -mx-1"   
                        : "border-transparent hover:border-zinc-600"
                    }`}
                >
                    <Image
                        src={img}
                        alt={`Миниатюра ${index + 1}`}
                        width={120}
                        height={80}
                        className="object-cover w-full h-full"
                    />
                </button>
            ))}
        </div>
    );
}