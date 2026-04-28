// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";
import { useDebounce } from "../features/Navbar/hooks/useDebounce";
import { Product, ProductsFilter } from "@/src/types";

const supabase = createClient();

export const useProducts = (filters: ProductsFilter) => {
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
            let query = supabase
                .from("products")
                .select("*");

            if (debouncedSearch) {
                const searchTerm = `%${debouncedSearch}%`;
                query = query.or(
                    `name.ilike.${searchTerm},oem.ilike.${searchTerm},brand.ilike.${searchTerm}`
                );
            }

            if (filters.brand) {
                query = query.eq("brand", filters.brand);
            }

            if (filters.onlyInStock) {
                query = query.gt("stock", 0);
            }

            if (filters.sort === "price_asc") {
                query = query.order("price", { ascending: true });
            } else if (filters.sort === "price_desc") {
                query = query.order("price", { ascending: false });
            } else {
                query = query.order("created_at", { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                console.error("Ошибка загрузки товаров:", error);
                throw error;
            }

            return data || [];
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
    });
};