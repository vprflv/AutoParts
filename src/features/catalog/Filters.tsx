"use client";

import { X } from "lucide-react";
import {ProductsFilter} from "@/src/types";

type SortOption = "default" | "price_asc" | "price_desc";

interface FiltersProps {
    filters: ProductsFilter
    setFilters: (newFilters: Partial<ProductsFilter>) => void;
    resetFilters:() => void;
    brands: string[];
}

export default function Filters({ filters, setFilters, brands, resetFilters }: FiltersProps) {
    return (
        <div className="w-80 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sticky top-24 self-start">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold">Фильтры</h2>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                    Сбросить
                </button>
            </div>

            {/* Сортировка по цене */}
            <div className="mb-8">
                <p className="text-sm text-zinc-400 mb-3">Сортировка</p>
                <select
                    value={filters.sort || "default"}
                    onChange={(e) => setFilters({ sort: e.target.value as SortOption })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                >
                    <option value="default">По умолчанию</option>
                    <option value="price_asc">Цена: сначала дороже</option>
                    <option value="price_desc">Цена: сначала дешевле</option>
                </select>
            </div>

            {/* Бренд */}
            <div className="mb-8">
                <p className="text-sm text-zinc-400 mb-3">Бренд</p>
                <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                        <button
                            key={brand}
                            onClick={() =>
                                setFilters({
                                    ...filters,
                                    brand: brand === filters.brand ? undefined : brand,
                                })
                            }
                            className={`px-4 py-2 rounded-2xl text-sm transition-all ${
                                filters.brand === brand
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            {/* Только в наличии */}
            <div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.onlyInStock || false}
                        onChange={(e) => setFilters({ onlyInStock: e.target.checked })}
                        className="w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm text-zinc-300">Только в наличии</span>
                </label>
            </div>
        </div>
    );
}