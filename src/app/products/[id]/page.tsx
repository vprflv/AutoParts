"use client";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/src/hooks/useProducts";
import { ArrowLeft } from "lucide-react";
import {ProductGallery} from "@/src/features/parts-detail/components/ProductGallery";
import ProductActions from "@/src/features/parts-detail/components/ProductActions";

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

    const product = allProducts.find((p) => p.id === productId);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Товар не найден</div>;

    return (
        <div className="min-h-screen bg-zinc-950 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-7 lg:py-10">

                {/* Кнопка назад */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-5 md:mb-7 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Назад в каталог</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12">
                    {/* Галерея */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images} />
                    </div>

                    {/* Информация */}
                    <div className="lg:col-span-5 space-y-4 md:space-y-5 lg:space-y-6">
                        <div>
                            <p className="text-sm text-zinc-500">{product.brand} • {product.category}</p>
                            <h1 className="text-[26px] sm:text-3xl md:text-[34px] lg:text-4xl font-bold mt-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-red-500 mt-3 text-base">OEM: {product.oem}</p>
                        </div>

                        <div>
                            <p className="text-4xl sm:text-5xl md:text-[52px] font-bold text-white">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className={`mt-2 text-sm ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                В наличии: {product.stock} шт.
                            </p>
                        </div>

                        <ProductActions product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}