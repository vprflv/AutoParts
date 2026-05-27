"use client";

import { useState } from "react";
import {Eye, X, AlertTriangle, CheckCircle} from "lucide-react";

interface HistoryItem {
    id: string;
    createdAt: Date;
    fileName: string | null;
    errors: any;
    user?: { name?: string | null; email?: string | null };
}

interface HistoryDetailModalProps {
    historyItem: HistoryItem;
}

export default function HistoryDetailModal({ historyItem }: HistoryDetailModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const errors = Array.isArray(historyItem.errors) ? historyItem.errors : [];
    const hasErrors = errors.length > 0;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
                title="Показать ошибки"
                disabled={!hasErrors}
            >
                <Eye size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Заголовок */}
                        <div className="px-8 py-5 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-red-500" size={26} />
                                <div>
                                    <h2 className="text-2xl font-semibold">Ошибки импорта</h2>
                                    <p className="text-zinc-500 text-sm">
                                        {historyItem.fileName || "Без названия файла"} • {new Date(historyItem.createdAt).toLocaleString('ru-RU')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Основное содержимое */}
                        <div className="flex-1 overflow-auto p-8">
                            {hasErrors ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-red-400 font-medium text-lg">
                                            Найдено ошибок: <span className="font-bold">{errors.length}</span>
                                        </h3>
                                    </div>

                                    <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6 max-h-[60vh] overflow-auto">
                                        <ul className="space-y-3">
                                            {errors.map((err: string, index: number) => (
                                                <li
                                                    key={index}
                                                    className="flex gap-3 bg-zinc-950/70 border-l-4 border-red-600 pl-4 py-3 rounded-r-xl text-red-200"
                                                >
                                                    <span className="text-red-500 font-mono text-sm mt-0.5 shrink-0">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <span className="leading-relaxed">{err}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                    <p className="text-xl text-green-400">Импорт прошёл успешно</p>
                                    <p className="text-zinc-500 mt-2">Ошибок не обнаружено</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}