"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/src/features/Navbar/components/Navbar";
import { useProducts } from "@/src/features/Navbar/hooks/useProducts";
import Filters from "@/src/features/catalog/Filters";
import ProductCard from "@/src/features/catalog/ProductCard";
import { ProductsFilter } from "@/src/types";
import { products as allProducts } from "@/src/lib/mockData";
import { usePagination } from "@/src/features/catalog/hooks/usePagination";
import FeedbackModal from "@/src/features/feedback/components/FeedbackModal";
import { SlidersHorizontal, MessageCircle } from "lucide-react";

export default function ProductsPage() {
    const [filters, setFilters] = useState<ProductsFilter>({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [hideFloatingButton, setHideFloatingButton] = useState(false); // новое состояние

    const paginationRef = useRef<HTMLDivElement>(null);

    const { data: filteredProducts = [], isLoading } = useProducts(filters);

    const {
        currentPage,
        totalPages,
        paginatedItems,
        totalItems,
        changePage,
        resetPagination,
    } = usePagination(filteredProducts, 12);

    const allBrands = useMemo(() => {
        return Array.from(new Set(allProducts.map((p) => p.brand))).sort();
    }, []);

    // Скрываем плавающую кнопку, когда дошли до пагинации
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHideFloatingButton(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (paginationRef.current) {
            observer.observe(paginationRef.current);
        }

        return () => observer.disconnect();
    }, [totalPages]);

    const handleSearchChange = (search: string) => {
        setFilters((prev) => ({ ...prev, search }));
        resetPagination();
    };

    const handleFilterChange = (newFilters: Partial<ProductsFilter>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        resetPagination();
    };

    const handleReset = () => {
        setFilters({
            search: filters.search,
            brand: undefined,
            onlyInStock: false,
            sort: "default",
        });
        resetPagination();
    };

    return (
        <>
            <Navbar onSearchChange={handleSearchChange} searchValue={filters.search} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                {/* Блок кнопок под поиском — только до lg (1024px) */}
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
                    {/* Блок фильтров */}
                    <div className={`
                        w-full lg:w-80 flex-shrink-0 transition-all duration-300
                        ${isFiltersOpen ? 'block' : 'hidden lg:block'}
                    `}>
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={allBrands}
                        />
                    </div>

                    {/* Основной контент */}
                    <div className="flex-1">
                        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-bold">Каталог автозапчастей</h1>
                            <p className="text-zinc-400 whitespace-nowrap">
                                Найдено: <span className="text-white font-medium">{totalItems}</span> товаров
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-20 text-zinc-400">Загрузка товаров...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                Ничего не найдено по вашему запросу
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                                    {paginatedItems.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Пагинация с ref для отслеживания */}
                                {totalPages > 1 && (
                                    <div ref={paginationRef} className="mt-12 flex justify-center">
                                        <div className="flex items-center gap-2 bg-zinc-900 px-5 py-3 rounded-2xl">
                                            <button
                                                onClick={() => changePage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                            >
                                                ← Назад
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => changePage(pageNum)}
                                                    className={`min-w-[40px] h-10 rounded-xl flex items-center justify-center transition-all text-sm ${
                                                        pageNum === currentPage
                                                            ? "bg-blue-600 text-white font-medium"
                                                            : "hover:bg-zinc-800"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => changePage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                            >
                                                Вперёд →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Плавающая кнопка "Оставить заявку" — только на xl+ и скрывается при достижении пагинации */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className={`hidden lg:block fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl transition-all active:scale-95 z-50 font-medium text-base
                    ${hideFloatingButton ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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