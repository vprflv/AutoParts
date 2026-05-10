"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/src/features/parts-detail/components/ProductGallery";
import ProductActions from "@/src/features/parts-detail/components/ProductActions";
import { Product } from "@/src/types";
import { useState } from "react";

const supabase = createClient();

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [activeTab, setActiveTab] = useState<"description" | "applicability">("description");

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
        return <div className="text-center py-20 text-zinc-400">Товар не найден</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
                {/* Кнопка назад */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Назад в каталог
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    {/* Галерея */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images || []} />
                    </div>

                    {/* Правая колонка */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <p className="uppercase tracking-widest text-sm text-zinc-500">
                                {product.brand} • {product.category}
                            </p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-2">
                                {product.name}
                            </h1>
                            <p className="text-cyan-400 mt-3">
                                OEM: <span className="text-white font-mono">{product.oem}</span>
                            </p>
                        </div>

                        {/* Характеристики с точками */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div>
                                <h3 className="text-sm uppercase text-zinc-500 mb-4">Характеристики</h3>
                                <div className="space-y-3 text-[15px]">
                                    {Object.entries(product.specifications).map(([key, value]) => {
                                        const keyStr = String(key).trim();
                                        const valueStr = String(value).trim();
                                        const dots = ".".repeat(Math.max(25, 48 - keyStr.length));

                                        return (
                                            <div key={key} className="flex items-baseline font-mono text-zinc-300">
                                                <span className="text-zinc-400">{keyStr}</span>
                                                <span className="flex-1 text-zinc-700 mx-2 text-xs tracking-[1px]">
                                                    {dots}
                                                </span>
                                                <span className="text-white text-right">{valueStr}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Цена и наличие */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3 pt-4">
                            <p className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className={`text-lg ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {product.stock > 0 ? `В наличии • ${product.stock} шт.` : "Нет в наличии"}
                            </p>
                        </div>

                        <ProductActions product={product} />
                    </div>
                </div>

                {/* ТАБЫ ВНИЗУ СТРАНИЦЫ */}
                <div className="max-w-4xl mx-auto mt-20">
                    <div className="flex border-b border-zinc-800 mb-8">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`px-8 py-4 text-lg font-medium transition-all border-b-2 ${
                                activeTab === "description"
                                    ? "text-white border-cyan-400"
                                    : "text-zinc-400 border-transparent hover:text-zinc-200"
                            }`}
                        >
                            Описание
                        </button>
                        <button
                            onClick={() => setActiveTab("applicability")}
                            className={`px-8 py-4 text-lg font-medium transition-all border-b-2 ${
                                activeTab === "applicability"
                                    ? "text-white border-cyan-400"
                                    : "text-zinc-400 border-transparent hover:text-zinc-200"
                            }`}
                        >
                            Применяемость
                        </button>
                    </div>

                    {/* Контент табов */}
                    {activeTab === "description" && product.description && (
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-[17px]">
                            {product.description}
                        </div>
                    )}

                    {activeTab === "applicability" && product.applicability && product.applicability.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {product.applicability.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-zinc-900 border border-zinc-700 hover:border-cyan-500/30 px-5 py-3 rounded-2xl text-zinc-300 transition-colors"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Пустые состояния */}
                    {activeTab === "description" && !product.description && (
                        <p className="text-zinc-500 italic">Описание пока отсутствует</p>
                    )}
                    {activeTab === "applicability" && (!product.applicability || product.applicability.length === 0) && (
                        <p className="text-zinc-500 italic">Информация о применяемости пока отсутствует</p>
                    )}
                </div>
            </div>
        </div>
    );
}