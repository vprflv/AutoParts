// src/features/admin/components/import/ImportPreviewStep.tsx
"use client";

import {ArrowLeft, CheckCircle, AlertTriangle, Plus, RefreshCw, Loader2} from "lucide-react";
import { ImportProduct } from "@/src/features/admin/hooks/product-import/types";

interface ImportPreviewStepProps {
    previewData: {
        toAdd: ImportProduct[];
        toUpdate: ImportProduct[];
        errors: string[];
        stats: { total: number; new: number; updates: number; errors: number };
    };
    onConfirm: () => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function ImportPreviewStep({
                                              previewData,
                                              onConfirm,
                                              onBack,
                                              isLoading,
                                          }: ImportPreviewStepProps) {
    const { toAdd, toUpdate, errors, stats } = previewData;

    return (
        <div className="p-8 space-y-8 overflow-auto max-h-[calc(95vh-180px)]">
            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-sm text-zinc-500">Всего строк</p>
                    <p className="text-3xl font-semibold mt-1">{stats.total}</p>
                </div>
                <div className="bg-emerald-950/50 border border-emerald-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Plus size={20} />
                        <p className="text-sm">Новые товары</p>
                    </div>
                    <p className="text-3xl font-semibold mt-1 text-emerald-400">{stats.new}</p>
                </div>
                <div className="bg-amber-950/50 border border-amber-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-amber-400">
                        <RefreshCw size={20} />
                        <p className="text-sm">Будет обновлено</p>
                    </div>
                    <p className="text-3xl font-semibold mt-1 text-amber-400">{stats.updates}</p>
                </div>
                {errors.length > 0 && (
                    <div className="bg-red-950/50 border border-red-900 rounded-2xl p-5">
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={20} />
                            <p className="text-sm">Ошибки</p>
                        </div>
                        <p className="text-3xl font-semibold mt-1 text-red-400">{stats.errors}</p>
                    </div>
                )}
            </div>

            {/* Ошибки */}
            {errors.length > 0 && (
                <div className="bg-red-950/30 border border-red-900 rounded-2xl p-6">
                    <h3 className="text-red-400 font-medium mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Ошибки в файле ({errors.length})
                    </h3>
                    <div className="max-h-52 overflow-auto text-sm space-y-1 text-red-300 font-mono">
                        {errors.slice(0, 20).map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                        {errors.length > 20 && <div className="text-red-500">... и ещё {errors.length - 20}</div>}
                    </div>
                </div>
            )}

            {/* Новые товары */}
            {toAdd.length > 0 && (
                <div>
                    <h3 className="text-emerald-400 font-medium mb-4 flex items-center gap-2">
                        <Plus size={20} />
                        Новые товары ({toAdd.length})
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-900">
                            <tr>
                                <th className="text-left p-4">OEM</th>
                                <th className="text-left p-4">Название</th>
                                <th className="text-left p-4">Бренд</th>
                                <th className="text-right p-4">Цена</th>
                                <th className="text-right p-4">Остаток</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                            {toAdd.slice(0, 10).map((product, i) => (
                                <tr key={i} className="hover:bg-zinc-900/50">
                                    <td className="p-4 font-mono text-emerald-400">{product.oem}</td>
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">{product.brand}</td>
                                    <td className="p-4 text-right font-medium">{product.price.toLocaleString()} ₽</td>
                                    <td className="p-4 text-right text-emerald-400">{product.stock}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {toAdd.length > 10 && (
                            <p className="text-center text-zinc-500 text-sm py-3">
                                + ещё {toAdd.length - 10} товаров
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Обновляемые товары */}
            {toUpdate.length > 0 && (
                <div>
                    <h3 className="text-amber-400 font-medium mb-4 flex items-center gap-2">
                        <RefreshCw size={20} />
                        Будут обновлены ({toUpdate.length})
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-900">
                            <tr>
                                <th className="text-left p-4">OEM</th>
                                <th className="text-left p-4">Название</th>
                                <th className="text-right p-4">Новая цена</th>
                                <th className="text-right p-4">Новый остаток</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                            {toUpdate.slice(0, 8).map((product, i) => (
                                <tr key={i} className="hover:bg-zinc-900/50">
                                    <td className="p-4 font-mono">{product.oem}</td>
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4 text-right font-medium">{product.price.toLocaleString()} ₽</td>
                                    <td className="p-4 text-right text-amber-400">{product.stock}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-4 pt-8 border-t border-zinc-800 sticky bottom-0 bg-zinc-900">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <ArrowLeft size={20} />
                    Назад
                </button>

                <button
                    onClick={onConfirm}
                    disabled={isLoading || (toAdd.length === 0 && toUpdate.length === 0)}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={22} />
                            Сохраняем в базу...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={22} />
                            Подтвердить импорт
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}