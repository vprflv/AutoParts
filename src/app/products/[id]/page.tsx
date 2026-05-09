"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/src/features/parts-detail/components/ProductGallery";
import ProductActions from "@/src/features/parts-detail/components/ProductActions";
import { Product } from "@/src/types";

const supabase = createClient();

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: async (): Promise<Product> => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", productId)
                .single();

            if (error || !data) throw new Error("Товар не найден");
            return data;
        },
        enabled: !!productId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-cyan-400">Загрузка товара...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400 bg-zinc-950">
                <h2 className="text-3xl mb-4">Товар не найден</h2>
                <button
                    onClick={() => router.push("/catalog")}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                >
                    Вернуться в каталог
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
                {/* Кнопка назад */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors mb-6 sm:mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Назад в каталог</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Галерея */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images || []} />
                    </div>

                    {/* Информация о товаре */}
                    <div className="lg:col-span-5 space-y-6 lg:space-y-8">
                        <div>
                            <p className="text-sm uppercase tracking-widest text-zinc-500">
                                {product.brand} • {product.category}
                            </p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-3 text-white">
                                {product.name}
                            </h1>
                            <p className="text-blue-400 mt-4 text-base sm:text-lg">
                                <span className="text-white">OEM</span>: {product.oem}
                            </p>
                        </div>

                        {/* Цена и наличие — исправленный блок */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tighter">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className={`text-base sm:text-lg ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {product.stock > 0 ? `В наличии • ${product.stock} шт.` : "Нет в наличии"}
                            </p>
                        </div>

                        {/* Действия */}
                        <ProductActions product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}