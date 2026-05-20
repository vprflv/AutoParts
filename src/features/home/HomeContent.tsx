"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/src/features/Navbar/components/Navbar";
import { useAllProducts } from "@/src/hooks/useAllProducts";
import { useCatalogFilters } from "@/src/hooks/useCatalogFilters";
import { useFloatingButton } from "@/src/hooks/useFloatingButton";

import Filters from "@/src/features/catalog/components/Filters";

import Pagination from "@/src/features/catalog/components/Pagination";
import FeedbackModal from "@/src/features/feedback/components/FeedbackModal";

import { SlidersHorizontal, MessageCircle } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/features/catalog/components/productDetail/ProductDetailCard";

export default function HomeContent() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const showFloatingButton = useFloatingButton();
    const searchParams = useSearchParams();

    const { filters, handleSearchChange, handleFilterChange, handleReset, changePage } =
        useCatalogFilters();

    const { data: allProducts = [], isLoading: productsLoading, isError } = useAllProducts();

    const currentPage = parseInt(searchParams.get("page") || "1");
    const limit = 12;

    // Клиентская фильтрация
    const filteredAndSorted = useMemo(() => {
        if (!allProducts?.length) return [];

        let result = [...allProducts];
        const searchTerm = filters.search?.toLowerCase().trim();

        if (searchTerm) {
            result = result.filter((p: Product) => {
                const term = searchTerm;
                return (
                    p.name?.toLowerCase().includes(term) ||
                    p.oem?.toLowerCase().includes(term) ||
                    p.brand?.toLowerCase().includes(term) ||
                    (Array.isArray(p.crossNumbers) &&
                        p.crossNumbers.some((cross: string) => cross.toLowerCase().includes(term)))
                );
            });
        }

        if (filters.brand) {
            result = result.filter((p: Product) => p.brand === filters.brand);
        }

        if (filters.onlyInStock) {
            result = result.filter((p: Product) => p.stock > 0);
        }

        if (filters.sort === "price_asc") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (filters.sort === "price_desc") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return result;
    }, [allProducts, filters]);

    const totalItems = filteredAndSorted.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedProducts = filteredAndSorted.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    );

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [currentPage]);

    // ==================== ОТЛАДКА ====================
    console.log("allProducts length:", allProducts.length);
    console.log("isLoading:", productsLoading);
    console.log("isError:", isError);

    if (productsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-white text-xl">Загрузка каталога...</div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 p-8">Ошибка загрузки товаров</div>;
    }

    return (
        <>
            <Navbar onSearchChange={handleSearchChange} searchValue={filters.search} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    <div className={`w-full lg:w-80 flex-shrink-0 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={[...new Set(allProducts.map((p: Product) => p.brand).filter(Boolean))]}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-bold">Каталог автозапчастей</h1>
                            <p className="text-zinc-400">
                                Найдено: <span className="text-cyan-300 font-medium">{totalItems}</span> товаров
                            </p>
                        </div>

                        {paginatedProducts.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                Ничего не найдено по вашему запросу
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {paginatedProducts.map((product: Product) => (
                                        // <ProductCard key={product.id} product={product} />
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

            {showFloatingButton && (
                <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="hidden lg:block fixed bottom-8 right-8 border-2 border-cyan-500 hover:bg-cyan-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50"
                >
                    💬 Оставить заявку
                </button>
            )}

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </>
    );
}