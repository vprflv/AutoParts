"use client";

import { useState, useCallback } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useBulkPhotoUpload } from "@/src/features/admin/hooks/useBulkPhotoUpload";
import ImportResultModal from "@/src/features/admin/components/import/ImportResultModal"; // ← добавь этот импорт

interface BulkPhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkPhotoUploadModal({ isOpen, onClose }: BulkPhotoUploadModalProps) {
    const bulkUpload = useBulkPhotoUpload();

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Состояние для модалки результата
    const [resultModal, setResultModal] = useState<{
        isOpen: boolean;
        result: any;
    }>({
        isOpen: false,
        result: null,
    });

    const addFiles = useCallback((newFiles: File[]) => {
        const imageFiles = newFiles.filter(file => file.type.startsWith("image/"));

        setFiles(prev => [...prev, ...imageFiles]);

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    }, [addFiles]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files));
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);

        try {
            const result = await bulkUpload.mutateAsync(files);

            // Открываем модалку с результатом
            setResultModal({
                isOpen: true,
                result: result,
            });

            // Очищаем форму
            setFiles([]);
            setPreviews([]);

        } catch (err) {
            // Ошибка уже обработана внутри хука
        } finally {
            setUploading(false);
        }
    };

    const closeResultModal = () => {
        setResultModal({ isOpen: false, result: null });
        // Закрываем основную модалку через небольшую задержку
        setTimeout(onClose, 300);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
                <div className="bg-zinc-900 rounded-3xl w-full max-w-3xl overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Массовая загрузка фото</h2>
                            <p className="text-zinc-400 text-sm mt-1">
                                Фото будут привязаны к товарам по OEM в названии файла
                            </p>
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                            <X size={28} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Drag & Drop */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                                isDragging ? "border-white bg-white/5" : "border-zinc-700 hover:border-zinc-500"
                            }`}
                        >
                            <Upload size={56} className="mx-auto mb-4 text-zinc-500" />
                            <p className="text-xl text-zinc-300 mb-1">Перетащите фото сюда</p>
                            <p className="text-zinc-500 mb-6">или нажмите для выбора файлов</p>

                            <label className="inline-block bg-white text-black px-8 py-3.5 rounded-2xl font-medium cursor-pointer hover:bg-zinc-200 transition">
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

                        {/* Превью */}
                        {files.length > 0 && (
                            <div>
                                <p className="text-sm text-zinc-400 mb-4">
                                    Выбрано: <span className="text-white font-medium">{files.length}</span> фото
                                </p>
                                <div className="grid grid-cols-4 gap-4 max-h-96 overflow-auto p-1">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative group rounded-2xl overflow-hidden">
                                            <img
                                                src={preview}
                                                alt={files[index].name}
                                                className="w-full aspect-square object-cover"
                                            />
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Кнопка загрузки */}
                        <button
                            onClick={handleUpload}
                            disabled={files.length === 0 || uploading}
                            className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg disabled:opacity-50 transition flex items-center justify-center gap-3"
                        >
                            {uploading ? (
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
                    </div>
                </div>
            </div>

            {/* Модалка с результатом */}
            <ImportResultModal
                isOpen={resultModal.isOpen}
                onClose={closeResultModal}
                type="photos"
                result={resultModal.result}
                title="Результат загрузки фотографий"
            />
        </>
    );
}