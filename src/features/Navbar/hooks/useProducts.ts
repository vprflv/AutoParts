// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { products } from "@/src/lib/mockData";
import { useDebounce } from "./useDebounce";
import {Product, ProductsFilter} from "@/src/types";

export type SortOption = "default" | "price_asc" | "price_desc";

export const useProducts = (filters:ProductsFilter
) => {
    const debouncedSearch = useDebounce(filters.search || "", 300);

    return useQuery({
        queryKey: [
            "products",
            {
                search: debouncedSearch,
                brand: filters.brand,
                onlyInStock: filters.onlyInStock,
                sort: filters.sort,
            },
        ],
        queryFn: async (): Promise<Product[]> => {
            await new Promise((r) => setTimeout(r, 200));

            let filtered = [...products];

            // 1. Поиск по нескольким полям
            if (debouncedSearch) {
                const terms = debouncedSearch.toLowerCase().trim().split(/\s+/);

                filtered = filtered.filter((product) => {
                    return terms.every((term) =>
                        product.name.toLowerCase().includes(term) ||
                        product.oem.toLowerCase().includes(term) ||
                        product.brand.toLowerCase().includes(term) ||
                        product.applicability.some((car) => car.toLowerCase().includes(term))
                    );
                });
            }

            // 2. Фильтр по бренду
            if (filters.brand) {
                filtered = filtered.filter((p) => p.brand === filters.brand);
            }

            // 3. Фильтр "Только в наличии"
            if (filters.onlyInStock) {
                filtered = filtered.filter((p) => p.stock > 0);
            }

            // 4. Сортировка по цене
            if (filters.sort === "price_asc") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (filters.sort === "price_desc") {
                filtered.sort((a, b) => b.price - a.price);
            }
            // "default" — без сортировки (оставляем как в mockData)

            return filtered;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
};