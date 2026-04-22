
"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useAdminProducts } from "@/src/features/admin/hooks/useAdminProducts";
import ImportProductsModal from "@/src/features/admin/components/import/ImportProductsModal";
import {Product} from "@/src/types";
import EditProductModal from "@/src/features/admin/components/EditProductModal";


export default function AdminProducts() {
    const { products, isLoading, deleteProduct} = useAdminProducts();

    const [searchTerm, setSearchTerm] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);



    // Фильтрация товаров
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.oem.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm("Вы действительно хотите удалить этот товар?")) {
            deleteProduct(id);
        }
    };

    if (isLoading) {
        return <div className="text-center py-20 text-zinc-400">Загрузка товаров...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Управление товарами</h1>
                    <p className="text-zinc-400 mt-1">Всего товаров: {products.length}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-2xl font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Импорт из Excel
                    </button>

                    <button
                        onClick={() => alert("Добавление одного товара — скоро будет")}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Добавить вручную
                    </button>
                </div>
            </div>

            {/* Поиск */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Поиск по названию, бренду или OEM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-4 rounded-3xl focus:outline-none focus:border-blue-600 text-base"
                />
            </div>

            {/* Таблица товаров */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="text-left py-5 px-8 font-medium text-zinc-400 w-20">Фото</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Название</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Бренд</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">OEM</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Цена</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Остаток</th>
                        <th className="w-24"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="py-5 px-8">
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden relative">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </td>
                            <td className="py-5 px-8 font-medium line-clamp-2 pr-4">{product.name}</td>
                            <td className="py-5 px-8 text-zinc-400">{product.brand}</td>
                            <td className="py-5 px-8 text-zinc-400 font-mono text-sm">{product.oem}</td>
                            <td className="py-5 px-8 font-semibold">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </td>
                            <td className="py-5 px-8">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 5
                          ? "bg-emerald-500/10 text-emerald-500"
                          : product.stock > 0
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                  }`}>
                    {product.stock} шт.
                  </span>
                            </td>
                            <td className="py-5 px-8">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-zinc-800 rounded-xl text-blue-500"
                                    >
                                        <Edit2 className="w-5 h-5"/>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 hover:bg-zinc-800 rounded-xl text-red-500"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center text-zinc-500">
                        Ничего не найдено по вашему запросу
                    </div>
                )}
            </div>

            {/* Модальное окно импорта */}
            <ImportProductsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />

            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                }}
                product={editingProduct}
            />
        </div>
    );
}