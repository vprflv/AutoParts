"use client";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/src/features/Navbar/hooks/useProducts";
import { useCartStore } from "@/src/store/useCartStore";
import { ShoppingCart, Heart, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { data: allProducts = [], isLoading } = useProducts({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const addItem = useCartStore((state) => state.addItem);

    const product = allProducts.find((p) => p.id === productId);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Товар не найден</div>;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            oem: product.oem,
            price: product.price,
            image: product.images[0],
        });
    };

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <div className="min-h-screen bg-zinc-950 py-10">
            <div className="max-w-6xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Назад в каталог
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Галерея */}
                    <div className="lg:col-span-7">
                        {/* Большое главное фото */}
                        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
                            <Image
                                src={product.images[selectedImageIndex]}
                                alt={product.name}
                                width={800}
                                height={500}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>

                        {/* Миниатюры */}
                        {product.images.length > 1 && (
                            <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                                {product.images.map((img, index) => (
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
                                            alt={`${product.name} ${index + 1}`}
                                            width={120}
                                            height={80}
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Информация о товаре */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <p className="text-sm text-zinc-500">{product.brand} • {product.category}</p>
                            <h1 className="text-4xl font-bold mt-3 leading-tight">{product.name}</h1>
                            <p className="text-red-500 mt-4 text-lg">OEM: {product.oem}</p>
                        </div>

                        <div>
                            <p className="text-5xl font-bold text-white">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>

                        <div className={`inline-flex px-5 py-2.5 rounded-full text-sm font-medium ${
                            product.stock > 10 ? "bg-emerald-500/10 text-emerald-500" :
                                product.stock > 0 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                        }`}>
                            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
                        </div>

                        <div>
                            <p className="text-sm text-zinc-400 mb-3">Применимость:</p>
                            <div className="flex flex-wrap gap-2">
                                {product.applicability.map((car, index) => (
                                    <span key={index} className="bg-zinc-800 px-4 py-2 rounded-2xl text-sm text-zinc-300">
                    {car}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-8">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.985]"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Добавить в корзину
                            </button>

                            <button className="w-full border border-zinc-700 hover:bg-zinc-900 py-5 rounded-2xl font-medium flex items-center justify-center gap-3 transition-colors">
                                <Heart className="w-6 h-6" />
                                В избранное
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                            src={product.images[selectedImageIndex]}
                            alt={product.name}
                            width={1400}
                            height={1000}
                            className="max-h-[88vh] object-contain mx-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}