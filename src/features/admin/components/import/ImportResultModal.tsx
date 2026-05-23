"use client";

import { X, CheckCircle, AlertTriangle, Upload } from "lucide-react";

interface ImportResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "import" | "photos";
    result: any;
    title?: string;
}

export default function ImportResultModal({
                                              isOpen,
                                              onClose,
                                              type,
                                              result,
                                              title,
                                          }: ImportResultModalProps) {
    if (!isOpen) return null;

    const isSuccess = result?.success !== false;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg overflow-hidden">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
                    <div className="flex items-center gap-3">
                        {isSuccess ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        )}
                        <h3 className="text-xl font-semibold">
                            {title || (type === "import" ? "Результат импорта" : "Результат загрузки фото")}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Основной результат */}
                    {isSuccess ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center">
                            <p className="text-2xl font-bold text-green-400">
                                {type === "import"
                                    ? `${result.added + result.updated} товаров обработано`
                                    : `${result.success} фото загружено`}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                            <p className="text-red-400 font-medium">{result.error}</p>
                        </div>
                    )}

                    {/* Детальная статистика */}
                    {type === "import" && result.success && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-zinc-800 rounded-2xl p-4">
                                <p className="text-2xl font-bold text-green-400">{result.added}</p>
                                <p className="text-xs text-zinc-400">Новых</p>
                            </div>
                            <div className="bg-zinc-800 rounded-2xl p-4">
                                <p className="text-2xl font-bold text-blue-400">{result.updated}</p>
                                <p className="text-xs text-zinc-400">Обновлено</p>
                            </div>
                            <div className="bg-zinc-800 rounded-2xl p-4">
                                <p className="text-2xl font-bold text-amber-400">{result.skipped || 0}</p>
                                <p className="text-xs text-zinc-400">Пропущено</p>
                            </div>
                        </div>
                    )}

                    {type === "photos" && result.success !== undefined && (
                        <div className="space-y-3">
                            <div className="flex justify-between bg-zinc-800 rounded-2xl p-4">
                                <span>Успешно загружено</span>
                                <span className="font-semibold text-green-400">{result.success}</span>
                            </div>
                            {result.notFound && result.notFound > 0 && (
                                <div className="flex justify-between bg-zinc-800 rounded-2xl p-4 text-amber-400">
                                    <span>Товары не найдены</span>
                                    <span>{result.notFound}</span>
                                </div>
                            )}
                            {result.failed && result.failed > 0 && (
                                <div className="flex justify-between bg-zinc-800 rounded-2xl p-4 text-red-400">
                                    <span>Ошибок загрузки</span>
                                    <span>{result.failed}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Список ошибок (если есть) */}
                    {result.errors && result.errors.length > 0 && (
                        <div>
                            <p className="text-sm text-red-400 mb-2">Ошибки:</p>
                            <div className="max-h-48 overflow-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-sm">
                                {result.errors.slice(0, 8).map((err: string, i: number) => (
                                    <p key={i} className="text-red-400/90 py-1">• {err}</p>
                                ))}
                                {result.errors.length > 8 && (
                                    <p className="text-zinc-500 text-center py-2">... и ещё {result.errors.length - 8}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-700 p-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}