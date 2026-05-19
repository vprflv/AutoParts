// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/features/Navbar/hooks/useDebounce";
import { ProductsFilter } from "@/src/types";
import { useSearchParams } from "next/navigation";
import {getProducts} from "@/features/actions/productActions";


export const useProducts = (filters: ProductsFilter) => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;

    const debouncedSearch = useDebounce(filters.search?.trim() || "", 400);

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
            });

            if (debouncedSearch) params.set('search', debouncedSearch);
            if (filters.brand) params.set('brand', filters.brand);
            if (filters.onlyInStock) params.set('onlyInStock', 'true');
            if (filters.sort) params.set('sort', filters.sort);

            const res = await fetch(`/api/products?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch products');
            return res.json();
        },

        enabled: true,
    });
};