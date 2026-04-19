// src/features/catalog/hooks/usePagination.ts
import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], defaultItemsPerPage = 24) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const changeItemsPerPage = (newValue: number) => {
        setItemsPerPage(newValue);
        setCurrentPage(1);
    };

    const resetPagination = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedItems,
        totalItems,
        changePage,
        changeItemsPerPage,
        resetPagination,
    };
}