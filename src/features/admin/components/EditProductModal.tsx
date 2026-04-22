"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { Product } from "@/src/types";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
    const { addOrUpdateProducts } = useAdminProducts();

    const [formData, setFormData] = useState<Partial<Product>>({});
    const [images, setImages] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");

    // Инициализация формы при открытии
    useEffect(() => {
        if (product) {
            setFormData({ ...product });
            setImages([...product.images]);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleSave = () => {
        if (!formData.name || !formData.brand || !formData.oem) {
            alert("Заполните обязательные поля: Название, Бренд, OEM");
            return;
        }

        const updatedProduct: Product = {
            ...product,
            ...formData,
            images: images.length > 0 ? images : product.images,
        } as Product;

        addOrUpdateProducts([updatedProduct]);
        alert("Товар успешно обновлён!");
        onClose();
    };

    const addImage = () => {
        if (newImageUrl.trim()) {
            setImages([...images, newImageUrl.trim()]);
            setNewImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const updateField = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Редактирование товара</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 space-y-8">
                    {/* Галерея фото */}
                    <div>
                        <p className="text-sm text-zinc-400 mb-3">Фотографии товара</p>
                        <div className="flex flex-wrap gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-28 h-28 bg-zinc-800 rounded-2xl overflow-hidden group">
                                    <Image src={img} alt="" fill className="object-cover" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <input
                                type="text"
                                placeholder="URL нового изображения"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                            <button
                                onClick={addImage}
                                className="bg-zinc-800 hover:bg-zinc-700 px-6 rounded-2xl"
                            >
                                <Plus size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Основные поля */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Название товара *</label>
                            <input
                                type="text"
                                value={formData.name || ""}
                                onChange={(e) => updateField("name", e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">OEM номер *</label>
                            <input
                                type="text"
                                value={formData.oem || ""}
                                onChange={(e) => updateField("oem", e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Бренд *</label>
                            <input
                                type="text"
                                value={formData.brand || ""}
                                onChange={(e) => updateField("brand", e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Категория</label>
                            <input
                                type="text"
                                value={formData.category || ""}
                                onChange={(e) => updateField("category", e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Цена (₽) *</label>
                            <input
                                type="number"
                                value={formData.price || ""}
                                onChange={(e) => updateField("price", Number(e.target.value))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Остаток на складе</label>
                            <input
                                type="number"
                                value={formData.stock || ""}
                                onChange={(e) => updateField("stock", Number(e.target.value))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400 block mb-2">Применяемость (через запятую)</label>
                        <textarea
                            value={formData.applicability?.join(", ") || ""}
                            onChange={(e) => updateField("applicability", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 h-24 focus:outline-none focus:border-blue-600"
                            placeholder="Toyota Camry 2018, Honda Accord 2017"
                        />
                    </div>
                </div>

                <div className="border-t border-zinc-800 p-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl border border-zinc-700 font-medium hover:bg-zinc-800"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
}