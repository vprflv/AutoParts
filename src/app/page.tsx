"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/src/features/Navbar/components/Navbar";
import { useProducts } from "@/src/hooks/useProducts";
import Filters from "@/src/features/catalog/components/Filters";
import ProductCard from "@/src/features/catalog/components/ProductCard";
import ProductCardSkeleton from "@/src/features/catalog/components/ProductCardSkeleton";
import Pagination from "@/src/features/catalog/components/Pagination";
import { ProductsFilter } from "@/src/types";
import FeedbackModal from "@/src/features/feedback/components/FeedbackModal";
import { SlidersHorizontal, MessageCircle } from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<ProductsFilter>({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const { data, isLoading } = useProducts(filters);

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const currentPage = data?.page || 1;

    const allBrands = useMemo(() => {
        return Array.from(new Set(products.map(p => p.brand))).sort();
    }, [products]);

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());

        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handleSearchChange = (search: string) => {
        setFilters(prev => ({ ...prev, search }));

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handleFilterChange = (newFilters: Partial<ProductsFilter>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handleReset = () => {
        setFilters({
            search: filters.search,
            brand: "",
            onlyInStock: false,
            sort: "default",
        });

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <Navbar onSearchChange={handleSearchChange} searchValue={filters.search} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                {/* Мобильные кнопки */}
                <div className="lg:hidden flex gap-3 mb-6">
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-5 py-3.5 rounded-2xl transition-colors font-medium"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Фильтры
                    </button>

                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3.5 rounded-2xl transition-colors font-medium text-white"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Заявка
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    <div className={`w-full lg:w-80 flex-shrink-0 transition-all duration-300 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={allBrands}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-bold">Каталог автозапчастей</h1>
                            <p className="text-zinc-400">
                                Найдено: <span className="text-white font-medium">{data?.total || 0}</span> товаров
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                Ничего не найдено по вашему запросу
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={changePage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="hidden lg:block fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl transition-all active:scale-95 z-50 font-medium text-base"
            >
                💬 Оставить заявку
            </button>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </>
    );
}