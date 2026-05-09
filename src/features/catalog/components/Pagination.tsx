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
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-3 rounded-3xl border border-zinc-700 shadow-inner">

                {/* Кнопка Назад */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-6 py-3 rounded-2xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center gap-2"
                >
                    ← Назад
                </button>

                {/* Номера страниц */}
                <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-[42px] h-11 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${
                                pageNum === currentPage
                                    ? " text-cyan-300 underline shadow-neon-main font-semibold"
                                    : "hover:bg-zinc-800  text-white "
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Кнопка Вперёд */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 rounded-2xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center gap-2"
                >
                    Вперёд →
                </button>
            </div>
        </div>
    );
}