"use client";

import { useState, useMemo } from "react";
import Navbar from "@/src/features/Navbar/components/Navbar";
import { useProducts } from "@/src/features/Navbar/hooks/useProducts";
import Filters from "@/src/features/catalog/Filters";
import ProductCard from "@/src/features/catalog/ProductCard";
import { ProductsFilter } from "@/src/types";
import { products as allProducts } from "@/src/lib/mockData";

export default function ProductsPage() {
    const [filters, setFilters] = useState<ProductsFilter>({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const { data: filteredProducts = [], isLoading } = useProducts(filters);

    const allBrands = useMemo(() => {
        const uniqueBrands = Array.from(
            new Set(allProducts.map((product) => product.brand))
        ).sort(); // сортируем по алфавиту

        return uniqueBrands;
    }, []); // пустой массив зависимостей — вычисляется только один раз

    const handleSearchChange = (search: string) => {
        setFilters((prev) => ({ ...prev, search }));
    };

    const handleFilterChange = (newFilters: Partial<ProductsFilter>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleReset = () => {
        setFilters({
            search: filters.search,     // оставляем текущий поиск
            brand: undefined,
            onlyInStock: false,
            sort: "default",
        });
    };

    return (
        <>
            <Navbar
                onSearchChange={handleSearchChange}
                searchValue={filters.search}
            />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-80 flex-shrink-0">
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={allBrands}           // ← теперь всегда все бренды
                        />
                    </div>

                    <div className="flex-1">
                        <div className="mb-8 flex items-center justify-between">
                            <h1 className="text-4xl font-bold">Каталог автозапчастей</h1>
                            <p className="text-zinc-400">
                                Найдено: <span className="text-white font-medium">{filteredProducts.length}</span> товаров
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-20 text-zinc-400">Загрузка товаров...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                Ничего не найдено по вашему запросу
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}