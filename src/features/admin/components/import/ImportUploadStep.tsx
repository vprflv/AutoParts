// src/features/admin/components/import/ImportUploadStep.tsx
"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImportUploadStepProps {
    onPreviewReady: (excelFile: File) => void;        // ← теперь только Excel
    excelFile: File | null;
    setExcelFile: (file: File | null) => void;
    isLoading: boolean;
}

export default function ImportUploadStep({
                                             onPreviewReady,
                                             excelFile,
                                             setExcelFile,
                                             isLoading,
                                         }: ImportUploadStepProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleExcelDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setExcelFile(file);
            toast.success("Excel файл загружен");
        } else {
            toast.error("Пожалуйста, загрузите файл .xlsx или .xls");
        }
    }, [setExcelFile]);

    const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setExcelFile(file);
            toast.success("Excel файл загружен");
        }
    };

    const handleContinue = () => {
        if (!excelFile) {
            toast.error("Сначала загрузите Excel файл");
            return;
        }
        onPreviewReady(excelFile);
    };

    return (
        <div className="p-8">
            <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-500" />
                    Файл прайса (Excel)
                </h3>

                <div
                    onDrop={handleExcelDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
                        isDragOver
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-zinc-700 hover:border-zinc-600"
                    }`}
                >
                    {excelFile ? (
                        <div className="flex items-center justify-center gap-4 bg-zinc-800 rounded-2xl p-6">
                            <FileSpreadsheet size={40} className="text-emerald-500" />
                            <div className="text-left">
                                <p className="font-medium text-lg">{excelFile.name}</p>
                                <p className="text-sm text-zinc-500">
                                    {(excelFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={() => setExcelFile(null)}
                                className="ml-auto text-red-500 hover:text-red-600 p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload size={64} className="mx-auto mb-6 text-zinc-500" />
                            <p className="text-2xl text-zinc-300 mb-2">Перетащите Excel файл сюда</p>
                            <p className="text-zinc-500 mb-8">или нажмите для выбора</p>

                            <label className="cursor-pointer bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition inline-block">
                                Выбрать файл .xlsx / .xls
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleExcelSelect}
                                    className="hidden"
                                />
                            </label>
                        </>
                    )}
                </div>
            </div>

            {/* Кнопка продолжения */}
            <div className="pt-8">
                <button
                    onClick={handleContinue}
                    disabled={!excelFile || isLoading}
                    className="w-full bg-white text-black py-5 rounded-2xl font-semibold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? "Обработка файла..." : "Продолжить → Предпросмотр импорта"}
                </button>

                <p className="text-center text-xs text-zinc-500 mt-4">
                    Будет выполнен анализ и показан список изменений
                </p>
            </div>
        </div>
    );
}