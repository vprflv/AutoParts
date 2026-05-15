"use client";

import { usePagination } from "@/features/catalog/hooks/usePagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const { getPaginationRange } = usePagination();
    const pageRange = getPaginationRange(currentPage, totalPages);

    return (
        <div className="mt-10 md:mt-12 flex justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 px-3 sm:px-4 py-2.5 sm:py-3 rounded-3xl border border-zinc-700 shadow-inner">

                {/* Кнопка Назад */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 sm:px-6 py-3 rounded-2xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[44px] sm:min-w-auto"
                >
                    <span className="text-lg sm:text-base">←</span>
                    <span className="hidden sm:inline ml-2 text-sm font-medium">Назад</span>
                </button>

                {/* Номера страниц */}
                <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2">
                    {pageRange.map((pageNum, index) => (
                        <span
                            key={index}
                            className={`min-w-[38px] sm:min-w-[42px] h-9 sm:h-11 rounded-2xl cursor-pointer flex items-center justify-center text-sm font-medium transition-all ${
                                typeof pageNum === 'number' && pageNum === currentPage
                                    ? "bg-zinc-800 text-cyan-300 shadow-neon-main font-semibold"
                                    : typeof pageNum === 'number'
                                        ? "hover:bg-zinc-800 text-white"
                                        : "text-zinc-500 cursor-default"
                            }`}
                            onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                        >
                            {pageNum}
                        </span>
                    ))}
                </div>

                {/* Кнопка Вперёд */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 sm:px-6 py-3 rounded-2xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[44px] sm:min-w-auto"
                >
                    <span className="hidden sm:inline mr-2 text-sm font-medium">Вперёд</span>
                    <span className="text-lg sm:text-base">→</span>
                </button>
            </div>
        </div>
    );
}