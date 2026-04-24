// src/features/catalog/Filters.tsx
"use client";

import { X, ChevronDown } from "lucide-react";
import { ProductsFilter } from "@/src/types";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

type SortOption = "default" | "price_asc" | "price_desc";

interface FiltersProps {
    filters: ProductsFilter;
    setFilters: (newFilters: Partial<ProductsFilter>) => void;
    resetFilters: () => void;
    brands: string[];
}

export default function Filters({ filters, setFilters, resetFilters, brands }: FiltersProps) {
    const sortOptions = [
        { value: "default", label: "По умолчанию" },
        { value: "price_asc", label: "Цена: сначала дешевле" },
        { value: "price_desc", label: "Цена: сначала дороже" },
    ];

    const currentOption = sortOptions.find(opt => opt.value === (filters.sort || "default"));

    return (
        <div className="w-full lg:w-80 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:sticky lg:top-24 self-start">

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

            {/* Кастомный Select с Headless UI */}
            <div className="mb-8">
                <p className="text-sm text-zinc-400 mb-3">Сортировка</p>

                <Listbox value={filters.sort || "default"} onChange={(value) => setFilters({ sort: value as SortOption })}>
                    <div className="relative">
                        <ListboxButton className="w-full bg-zinc-800 rounded-2xl px-5 py-4 text-sm flex items-center justify-between focus:outline-none focus:border-blue-600 transition-colors">
                            <span>{currentOption?.label}</span>
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                        </ListboxButton>

                        <ListboxOptions className="absolute mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-2 shadow-xl z-50 max-h-60 overflow-auto">
                            {sortOptions.map((option) => (
                                <ListboxOption
                                    key={option.value}
                                    value={option.value}
                                    className={({ active }) =>
                                        `px-5 py-3 text-sm cursor-pointer transition-colors ${
                                            active ? "bg-zinc-700 text-white" : "text-zinc-300"
                                        }`
                                    }
                                >
                                    {option.label}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
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