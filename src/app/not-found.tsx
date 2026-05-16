"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* 404 — уменьшен для мобильных */}
                <div className="mb-6">
                    <div className="text-[88px] sm:text-[110px] md:text-[120px] font-bold text-zinc-800 leading-none">
                        404
                    </div>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                        Страница не найдена
                    </p>
                </div>

                <p className="text-zinc-400 text-base sm:text-lg mb-10 px-2">
                    К сожалению, страница, которую вы ищете, не существует или была перемещена.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2.5 bg-white text-black hover:bg-zinc-200 transition-colors px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-[15px] sm:text-base"
                    >
                        <Home size={20} className="sm:w-5 sm:h-5" />
                        На главную
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2.5 border border-zinc-700 hover:bg-zinc-900 transition-colors px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-[15px] sm:text-base"
                    >
                        <ArrowLeft size={20} className="sm:w-5 sm:h-5" />
                        Назад
                    </button>
                </div>

                <div className="mt-10 text-zinc-500 text-xs sm:text-sm">
                    Если вы считаете, что это ошибка — напишите нам
                </div>
            </div>
        </div>
    );
}