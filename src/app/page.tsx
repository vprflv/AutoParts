"use client";

import { useState, useMemo } from "react";
import Navbar from "@/src/features/Navbar/components/Navbar";
import { useProducts } from "@/src/features/Navbar/hooks/useProducts";
import Filters from "@/src/features/catalog/Filters";
import ProductCard from "@/src/features/catalog/ProductCard";
import { ProductsFilter } from "@/src/types";
import { products as allProducts } from "@/src/lib/mockData";
import { usePagination } from "@/src/features/catalog/hooks/usePagination";
import FeedbackModal from "@/src/features/feedback/components/FeedbackModal";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function ProductsPage() {
    const [filters, setFilters] = useState<ProductsFilter>({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const { data: filteredProducts = [], isLoading } = useProducts(filters);

    // Пагинация
    const {
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedItems,
        totalItems,
        changePage,
        changeItemsPerPage,
        resetPagination,
    } = usePagination(filteredProducts, 24);

    const allBrands = useMemo(() => {
        return Array.from(new Set(allProducts.map((p) => p.brand))).sort();
    }, []);

    // Обработчики фильтров
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

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Фильтры */}
                    <div className="lg:w-80 flex-shrink-0">
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={allBrands}
                        />
                    </div>

                    {/* Основной контент */}
                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-4xl font-bold">Каталог автозапчастей</h1>
                            <p className="text-zinc-400">
                                Найдено: <span className="text-white font-medium">{totalItems}</span> товаров
                            </p>
                        </div>

                        {/* Управление пагинацией */}
                        {totalItems > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-zinc-900 px-6 py-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-zinc-400">Показывать по:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-600"
                                    >
                                        {ITEMS_PER_PAGE_OPTIONS.map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-sm text-zinc-400">
                                    Страница <span className="text-white font-medium">{currentPage}</span> из {totalPages}
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="text-center py-20 text-zinc-400">Загрузка товаров...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                Ничего не найдено по вашему запросу
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {paginatedItems.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Пагинация */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center">
                                        <div className="flex items-center gap-2 bg-zinc-900 px-6 py-3 rounded-2xl">
                                            <button
                                                onClick={() => changePage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                ← Назад
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => changePage(pageNum)}
                                                    className={`min-w-[40px] h-10 rounded-xl flex items-center justify-center transition-all ${
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
                                                className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            {/* Плавающая кнопка "Оставить заявку" */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl transition-all active:scale-95 z-50 font-medium"
            >
                💬 Оставить заявку
            </button>

            {/* Модалка обратной связи */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />


        </>
    );
}