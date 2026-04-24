"use client";

import { useState, useCallback } from "react";
import {Upload, FileSpreadsheet, Image as ImageIcon, Loader2, X} from "lucide-react";
import { useProductImport } from "../../hooks/useProductImport";

interface ImportUploadStepProps {
    onPreviewReady: (data: any) => void;
    excelFile: File | null;
    setExcelFile: (file: File | null) => void;
    imageFiles: File[];
    setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
    existingProducts: any[];
}

export default function ImportUploadStep({
                                             onPreviewReady,
                                             excelFile,
                                             setExcelFile,
                                             imageFiles,
                                             setImageFiles,
                                             existingProducts,
                                         }: ImportUploadStepProps) {
    const { parseImportFile } = useProductImport();

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setExcelFile(file);
            setProgress(0);
            setStatusText("");
        } else {
            alert("Пожалуйста, выберите файл Excel (.xlsx или .xls)");
        }
    };

    const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validImages = files.filter(f => f.type.startsWith("image/"));

        setImageFiles((prev: File[]) => [...prev, ...validImages]);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        const excel = files.find(f => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"));
        const images = files.filter(f => f.type.startsWith("image/"));

        if (excel) setExcelFile(excel);
        if (images.length > 0) {
            setImageFiles((prev: File[]) => [...prev, ...images]);
        }
    }, [setExcelFile, setImageFiles]);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);

    const handleParseFile = async () => {
        if (!excelFile) return;

        setIsProcessing(true);
        setProgress(0);
        setStatusText("Чтение файла...");

        try {
            setProgress(20);
            setStatusText("Парсинг Excel...");

            const result = await parseImportFile(excelFile, imageFiles, existingProducts);

            setProgress(90);
            setStatusText("Подготовка предпросмотра...");

            onPreviewReady(result);

            setProgress(100);
            setTimeout(() => setIsProcessing(false), 300);
        } catch (error: any) {
            alert(error.message || "Ошибка при обработке файла");
            setIsProcessing(false);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-8 space-y-10">
            {/* Excel файл */}
            <div>
                <label className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
                    <FileSpreadsheet className="w-5 h-5" /> Файл прайса (Excel)
                </label>
                <div
                    className={`border-2 border-dashed rounded-3xl p-12 text-center transition-colors ${dragOver ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-700'}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {excelFile ? (
                        <p className="text-emerald-500 font-medium text-lg">{excelFile.name}</p>
                    ) : (
                        <>
                            <Upload className="mx-auto w-14 h-14 text-zinc-500 mb-4" />
                            <p className="text-zinc-400">Перетащите .xlsx файл сюда или нажмите ниже</p>
                            <label className="mt-6 inline-block bg-zinc-800 hover:bg-zinc-700 px-8 py-4 rounded-2xl cursor-pointer text-sm">
                                Выбрать файл Excel
                                <input type="file" accept=".xlsx,.xls" onChange={handleExcelSelect} className="hidden" />
                            </label>
                        </>
                    )}
                </div>
            </div>

            {/* Фото */}
            <div>
                <label className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
                    <ImageIcon className="w-5 h-5" /> Фотографии товаров
                </label>
                <div className="border border-zinc-700 rounded-3xl p-8">
                    <label className="block text-center bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl cursor-pointer">
                        Добавить фотографии
                        <input type="file" multiple accept="image/*" onChange={handleImagesSelect} className="hidden" />
                    </label>

                    {imageFiles.length > 0 && (
                        <div className="grid grid-cols-6 gap-4 mt-8">
                            {imageFiles.map((file, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-full aspect-square object-cover rounded-2xl"
                                    />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Прогрессбар */}
            {isProcessing && (
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>{statusText}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <button
                onClick={handleParseFile}
                disabled={!excelFile || isProcessing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
                {isProcessing && <Loader2 className="animate-spin w-5 h-5" />}
                {isProcessing ? "Обработка..." : "Показать предпросмотр"}
            </button>
        </div>
    );
}