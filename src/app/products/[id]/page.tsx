
"use client";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/src/features/Navbar/hooks/useProducts";

import {ArrowLeft, Heart} from "lucide-react";
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
                        <ProductGallery images={product.images} />
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

                        <p className={`text-sm ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                            В наличии: {product.stock} шт.
                        </p>

                        <ProductActions product={product} />

                        <button className="w-full border border-zinc-700 hover:bg-zinc-900 py-5 rounded-2xl font-medium flex items-center justify-center gap-3 transition-colors">
                            <Heart className="w-6 h-6" />
                            В избранное
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}