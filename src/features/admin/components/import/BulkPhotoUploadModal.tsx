"use client";

import { useState, useCallback } from "react";
import { X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useBulkPhotoUpload } from "@/src/features/admin/hooks/useBulkPhotoUpload";
import { toast } from "react-hot-toast";

interface BulkPhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkPhotoUploadModal({ isOpen, onClose }: BulkPhotoUploadModalProps) {
    const bulkUpload = useBulkPhotoUpload();

    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith("image/")
        );
        setFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        try {
            await bulkUpload.mutateAsync(files);
            setFiles([]); // очищаем после успеха
            setTimeout(onClose, 1800);
        } catch (err) {
            // ошибка уже обработана в хуке
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden">
                {/* Заголовок */}
                <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Массовая загрузка фото</h2>
                        <p className="text-zinc-400 text-sm mt-1">
                            Названия файлов должны содержать OEM номер запчасти
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Drag & Drop зона */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
                            isDragging
                                ? "border-white bg-white/5"
                                : "border-zinc-700 hover:border-zinc-500"
                        }`}
                    >
                        <Upload size={56} className="mx-auto mb-4 text-zinc-500" />
                        <p className="text-xl text-zinc-300 mb-2">Перетащите фото сюда</p>
                        <p className="text-zinc-500">или нажмите для выбора файлов</p>

                        <label className="mt-6 inline-block bg-white text-black px-8 py-3.5 rounded-2xl font-medium cursor-pointer hover:bg-zinc-200 transition">
                            Выбрать изображения
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Список загруженных файлов */}
                    {files.length > 0 && (
                        <div>
                            <p className="text-sm text-zinc-400 mb-3">
                                Выбрано файлов: <span className="text-white">{files.length}</span>
                            </p>
                            <div className="max-h-80 overflow-auto space-y-2 pr-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-zinc-800 rounded-2xl px-5 py-3 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center">
                                                📸
                                            </div>
                                            <div>
                                                <p className="text-sm truncate max-w-[300px]">{file.name}</p>
                                                <p className="text-xs text-zinc-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Кнопка загрузки */}
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || bulkUpload.isPending}
                        className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
                    >
                        {bulkUpload.isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Загружаем фото...
                            </>
                        ) : (
                            <>
                                <Upload size={24} />
                                Загрузить {files.length} фото
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-zinc-500">
                        Фото будут автоматически привязаны к товарам по OEM номеру в названии файла
                    </p>
                </div>
            </div>
        </div>
    );
}