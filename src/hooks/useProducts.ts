// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/features/Navbar/hooks/useDebounce";
import { ProductsFilter } from "@/src/types";
import { useSearchParams, usePathname } from "next/navigation";

export const useProducts = (filters: ProductsFilter) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = 8;
    const debouncedSearch = useDebounce(filters.search?.trim() || "", 400);

    const isCatalogPage = pathname === "/catalog";

    return useQuery({
        queryKey: ["products", {
            search: debouncedSearch,
            brand: filters.brand,
            onlyInStock: filters.onlyInStock,
            sort: filters.sort,
            page,
            limit,
        }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(filters.brand && { brand: filters.brand }),
                ...(filters.onlyInStock && { onlyInStock: "true" }),
                ...(filters.sort !== "default" && { sort: filters.sort }),
            });

            const res = await fetch(`/api/products?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // cache: 'no-store' // можно попробовать force-cache позже
            });

            if (!res.ok) throw new Error('Failed to fetch products');
            return res.json();
        },
        enabled: isCatalogPage,
    });
};