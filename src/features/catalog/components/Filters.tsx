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
        <div className="w-full lg:w-80 bg-zinc-900 border border-zinc-700 rounded-3xl p-6 lg:sticky lg:top-24 self-start">

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold">Фильтры</h2>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Сбросить
                </button>
            </div>

            {/* Сортировка */}
            <div className="mb-8">
                <p className="text-sm text-zinc-400 mb-3">Сортировка</p>
                <Listbox value={filters.sort || "default"} onChange={(value) => setFilters({ sort: value as SortOption })}>
                    <div className="relative">
                        <ListboxButton className="w-full bg-zinc-800 border border-zinc-700 hover:border-cyan-400 rounded-2xl px-5 py-4 text-sm flex items-center justify-between focus:outline-none focus:border-cyan-400 transition-all">
                            <span>{currentOption?.label}</span>
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                        </ListboxButton>

                        <ListboxOptions className="absolute mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-2 shadow-xl z-50 max-h-60 overflow-auto">
                            {sortOptions.map((option) => (
                                <ListboxOption
                                    key={option.value}
                                    value={option.value}
                                    className={({ active }) =>
                                        `px-5 py-3 text-sm cursor-pointer transition-colors ${
                                            active ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-300 hover:bg-zinc-800"
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

            {/* Бренды — улучшенная версия */}
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
                            className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all border ${
                                filters.brand === brand
                                    ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/30"
                                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:border-cyan-400/30"
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            {/* Только в наличии */}
            <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.onlyInStock || false}
                        onChange={(e) => setFilters({ onlyInStock: e.target.checked })}
                        className="w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded focus:ring-cyan-400 cursor-pointer"
                    />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                        Только в наличии
                    </span>
                </label>
            </div>
        </div>
    );
}