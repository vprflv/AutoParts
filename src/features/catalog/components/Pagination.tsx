// src/features/catalog/components/Pagination.tsx
"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 bg-zinc-900 px-5 py-3 rounded-2xl">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    ← Назад
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`min-w-[40px] h-10 rounded-xl flex items-center justify-center transition-all text-sm ${
                            pageNum === currentPage
                                ? "bg-blue-600 text-white font-medium"
                                : "hover:bg-zinc-800"
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    Вперёд →
                </button>
            </div>
        </div>
    );
}