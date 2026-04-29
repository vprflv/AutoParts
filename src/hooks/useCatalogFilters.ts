// src/hooks/useCatalogFilters.ts
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductsFilter } from "@/src/types";

export function useCatalogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<ProductsFilter>({
        search: "",
        brand: "",
        onlyInStock: false,
        sort: "default" as const,
    });

    const changePage = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleSearchChange = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleFilterChange = useCallback((newFilters: Partial<ProductsFilter>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleReset = useCallback(() => {
        setFilters({
            search: filters.search,
            brand: "",
            onlyInStock: false,
            sort: "default",
        });

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    }, [router, searchParams, filters.search]);

    return {
        filters,
        setFilters,
        changePage,
        handleSearchChange,
        handleFilterChange,
        handleReset,
    };
}