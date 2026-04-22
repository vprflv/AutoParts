// src/features/admin/components/import/ImportPreviewStep.tsx
"use client";

import { CheckCircle, AlertCircle } from "lucide-react";

interface ImportPreviewStepProps {
    previewData: any;
    onConfirm: () => void;
    onBack: () => void;
}

export default function ImportPreviewStep({ previewData, onConfirm, onBack }: ImportPreviewStepProps) {
    if (!previewData) return null;

    const total = previewData.toAdd.length + previewData.toUpdate.length;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Предпросмотр импорта</h3>
                <div className="text-sm text-zinc-400">
                    Новых: <span className="text-emerald-500 font-medium">{previewData.toAdd.length}</span> |
                    Обновлений: <span className="text-amber-500 font-medium">{previewData.toUpdate.length}</span>
                </div>
            </div>

            <div className="overflow-auto max-h-[460px] border border-zinc-800 rounded-3xl mb-8">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-800 sticky top-0">
                    <tr>
                        <th className="text-left p-4 w-24">Статус</th>
                        <th className="text-left p-4">OEM</th>
                        <th className="text-left p-4">Название</th>
                        <th className="text-left p-4">Бренд</th>
                        <th className="text-left p-4">Цена</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {[...previewData.toAdd, ...previewData.toUpdate].slice(0, 100).map((p: any, i: number) => {
                        const isNew = previewData.toAdd.some((item: any) => item.oem === p.oem);
                        return (
                            <tr key={i} className="hover:bg-zinc-800/50">
                                <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isNew ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                            {isNew ? "Новый" : "Обновление"}
                                        </span>
                                </td>
                                <td className="p-4 font-mono text-sm">{p.oem}</td>
                                <td className="p-4 line-clamp-1">{p.name}</td>
                                <td className="p-4">{p.brand}</td>
                                <td className="p-4 font-semibold">{p.price.toLocaleString()} ₽</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {previewData.errors.length > 0 && (
                <div className="p-5 bg-red-500/10 border border-red-500 rounded-3xl mb-8">
                    <p className="text-red-400 font-medium mb-2">Ошибки ({previewData.errors.length}):</p>
                    <ul className="text-sm text-red-300 list-disc pl-5 space-y-1 max-h-48 overflow-auto">
                        {previewData.errors.map((err: string, i: number) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-2xl border border-zinc-700 font-medium hover:bg-zinc-800"
                >
                    Назад
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-semibold"
                >
                    Подтвердить импорт ({total} товаров)
                </button>
            </div>
        </div>
    );
}