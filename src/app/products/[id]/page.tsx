// app/products/[id]/page.tsx
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

            if (error || !data) {
                throw new Error("Товар не найден");
            }
            return data;
        },
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,     // 5 минут кэш
        gcTime: 1000 * 60 * 10,
    });

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Загрузка товара...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400">
                <h2 className="text-2xl mb-4">Товар не найден</h2>
                <button
                    onClick={() => router.push("/")}
                    className="text-blue-500 hover:underline"
                >
                    Вернуться в каталог
                </button>
            </div>
        );
    }

    // Теперь TypeScript точно знает, что product — это Product
    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-7 lg:py-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Назад в каталог</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images || []} />
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <p className="text-sm text-zinc-500">
                                {product.brand} • {product.category}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-red-500 mt-3">OEM: {product.oem}</p>
                        </div>

                        <div>
                            <p className="text-5xl font-bold text-white">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className={`mt-2 text-lg ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
                            </p>
                        </div>

                        <ProductActions product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}