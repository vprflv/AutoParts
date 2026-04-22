"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newProduct: any) => void;
}

export default function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        oem: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        applicability: "",
    });

    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");

    if (!isOpen) return null;

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setImages([...images, imageUrl.trim()]);
            setImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Добавьте хотя бы одно фото товара");
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            name: formData.name,
            oem: formData.oem,
            price: Number(formData.price),
            category: formData.category,
            brand: formData.brand,
            stock: Number(formData.stock),
            images: images,
            applicability: formData.applicability.split(",").map(item => item.trim()).filter(Boolean),
        };

        onSave(newProduct);
        onClose();

        // Сброс формы
        setFormData({
            name: "", oem: "", price: "", category: "", brand: "", stock: "", applicability: ""
        });
        setImages([]);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Добавить новый товар</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
                    {/* Фото товара */}
                    <div>
                        <p className="text-sm text-zinc-400 mb-3">Фотографии товара (минимум 1)</p>

                        <div className="flex gap-3 flex-wrap mb-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-24 h-24 bg-zinc-800 rounded-2xl overflow-hidden group">
                                    <Image src={img} alt="" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Вставьте URL изображения"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                            />
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="bg-zinc-800 hover:bg-zinc-700 px-6 rounded-2xl flex items-center gap-2"
                            >
                                <Plus size={20} /> Добавить
                            </button>
                        </div>
                    </div>

                    {/* Основные поля */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Название товара</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="Тормозные колодки Brembo"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">OEM номер</label>
                            <input
                                type="text"
                                required
                                value={formData.oem}
                                onChange={(e) => setFormData({ ...formData, oem: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="254856RTA"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Бренд</label>
                            <input
                                type="text"
                                required
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="Brembo"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Категория</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="Тормоза"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Цена (₽)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="2450"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-400 block mb-2">Количество на складе</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-600"
                                placeholder="12"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400 block mb-2">Применяемость (через запятую)</label>
                        <textarea
                            value={formData.applicability}
                            onChange={(e) => setFormData({ ...formData, applicability: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:outline-none focus:border-blue-600 h-24 resize-y"
                            placeholder="Toyota Camry 2018, Toyota Camry 2019, Honda Accord 2017"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg mt-4"
                    >
                        Добавить товар
                    </button>
                </form>
            </div>
        </div>
    );
}