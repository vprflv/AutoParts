"use client";


import { X, Upload, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";

import { Product } from "@/src/types";
import { useEditProduct } from "@/features/admin/hooks/useEditProduct";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
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

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Редактирование товара</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 space-y-8">
                    {/* Фото */}
                    <div>
                        <p className="text-sm text-zinc-400 mb-3">Фотографии ({images.length}/10)</p>

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-zinc-500 transition mb-6 cursor-pointer"
                        >
                            <Upload size={48} className="mx-auto mb-3 text-zinc-500" />
                            <p className="text-zinc-300">Перетащите фото сюда</p>
                            <label className="mt-3 inline-block bg-white text-black px-6 py-3 rounded-2xl cursor-pointer hover:bg-zinc-200">
                                Выбрать файлы
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleFilesSelect(Array.from(e.target.files))}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-32 h-32 bg-zinc-800 rounded-2xl overflow-hidden group">
                                    <Image src={img} alt="" fill className="object-cover" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Форма */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Название *</label>
                            <input value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)}
                                   className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5" />
                        </div>
                        {/* Остальные поля оставь как было */}
                    </div>

                    {/* Применяемость */}
                    <div>
                        <label className="text-sm text-zinc-400 block mb-2">Применяемость</label>
                        <textarea
                            value={Array.isArray(formData.applicability) ? formData.applicability.join(", ") : ""}
                            onChange={(e) => updateField("applicability", e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 h-28"
                            placeholder="Toyota Camry, Honda Civic..."
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-800">
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploading}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Сохранение...
                            </>
                        ) : (
                            "Сохранить изменения"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}