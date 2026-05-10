// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";
import { useDebounce } from "@/features/Navbar/hooks/useDebounce";
import {  ProductsFilter } from "@/src/types";
import { useSearchParams } from "next/navigation";

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
            const supabase = createClient();

            let query = supabase
                .from("products")
                .select("*", { count: "exact" });

            if (debouncedSearch) {
                const term = `%${debouncedSearch}%`;
                query = query.or(
                    `name.ilike.${term},oem.ilike.${term},brand.ilike.${term},crossNumbers.ilike.${term}`
                );
            }

            if (filters.brand) query = query.eq("brand", filters.brand);
            if (filters.onlyInStock) query = query.gt("stock", 0);

            if (filters.sort === "price_asc") {
                query = query.order("price", { ascending: true });
            } else if (filters.sort === "price_desc") {
                query = query.order("price", { ascending: false });
            } else {
                query = query.order("created_at", { ascending: false });
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error, count } = await query.range(from, to);

            if (error) {
                // Логируем только реальные ошибки, а не пустой объект
                if (error.message || error.code) {
                    console.warn("⚠️ Ошибка при загрузке товаров:", {
                        message: error.message,
                        code: error.code,
                        details: error.details,
                        hint: error.hint,
                    });
                }
                throw error;
            }

            return {
                products: data || [],
                total: count || 0,
                page,
                totalPages: Math.ceil((count || 0) / limit),
            };
        },

        staleTime: 0,
        gcTime: 0,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};