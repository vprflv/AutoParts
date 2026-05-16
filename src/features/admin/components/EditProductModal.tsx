"use client";

import { useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useEditProduct } from "@/src/features/admin/hooks/useEditProduct";
import { Product } from "@/src/types";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function EditProductModal({
                                             isOpen,
                                             onClose,
                                             product,
                                         }: EditProductModalProps) {
    const {
        formData,
        images,
        isSaving,
        isUploading,
        updateField,
        handleSave,
        removeImage,
        handleDrop,
        handleFilesSelect,
    } = useEditProduct(product);

    // Закрываем модалку после успешного сохранения
    useEffect(() => {
        if (!isSaving && product && !isOpen) {
            // Можно добавить сброс формы при закрытии, если нужно
        }
    }, [isSaving, isOpen, product]);

    if (!isOpen || !product) return null;

    const onSubmit = async () => {
        const success = await handleSave();
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-8 py-5">
                    <h2 className="text-2xl font-bold">Редактирование товара</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 space-y-8">
                    {/* Изображения */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Изображения товара</h3>

                        {/* Drag & Drop зона */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-zinc-700 hover:border-blue-600 rounded-3xl p-8 text-center transition-colors mb-6"
                        >
                            <Upload className="w-10 h-10 mx-auto text-zinc-500 mb-3" />
                            <p className="text-zinc-400">Перетащите фото сюда или</p>
                            <label className="inline-block mt-3 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            handleFilesSelect(Array.from(e.target.files));
                                        }
                                    }}
                                />
                                Выбрать файлы
                            </label>
                        </div>

                        {/* Превью загруженных изображений */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Фото ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-2xl border border-zinc-800"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Форма */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Название товара *</label>
                            <input
                                type="text"
                                value={formData.name || ""}
                                onChange={(e) => updateField("name", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Бренд *</label>
                            <input
                                type="text"
                                value={formData.brand || ""}
                                onChange={(e) => updateField("brand", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">OEM / Артикул *</label>
                            <input
                                type="text"
                                value={formData.oem || ""}
                                onChange={(e) => updateField("oem", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Цена (₽) *</label>
                            <input
                                type="number"
                                value={formData.price || ""}
                                onChange={(e) => updateField("price", Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Остаток на складе</label>
                            <input
                                type="number"
                                value={formData.stock || 0}
                                onChange={(e) => updateField("stock", Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">Описание</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => updateField("description", e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl px-5 py-4 focus:outline-none focus:border-blue-600 resize-y"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">
                                Применяемость (через запятую)
                            </label>
                            <input
                                type="text"
                                value={Array.isArray(formData.applicability)
                                    ? formData.applicability.join(", ")
                                    : ""}
                                onChange={(e) => updateField("applicability", e.target.value)}
                                placeholder="Toyota Camry, Lexus ES, ..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Футер */}
                <div className="border-t border-zinc-800 p-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isSaving || isUploading}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isSaving ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                </div>
            </div>
        </div>
    );
}