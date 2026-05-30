"use client";

import { Plus, Search, Edit2, Trash2, Upload, AlertTriangle } from "lucide-react";
import { useAdminProductsPage } from "@/features/admin/hooks/useAdminProductsPage";
import ImportProductsModal from "@/features/admin/components/import/products/ImportProductsModal";
import EditProductModal from "@/src/features/admin/components/EditProductModal";
import BulkPhotoUploadModal from "@/features/admin/components/import/images/BulkPhotoUploadModal";
import ProductImage from "@/features/admin/components/ProductImage";
import {useAdminProducts} from "@/features/admin/hooks/useAdminProducts";
import {useEffect} from "react";

export default function AdminProducts() {
    const {  refetch } = useAdminProducts();
    const {
        filteredProducts,
        isLoading,
        searchTerm,
        setSearchTerm,
        isImportModalOpen,
        setIsImportModalOpen,
        editingProduct,
        setEditingProduct,
        isEditModalOpen,
        setIsEditModalOpen,
        isBulkModalOpen,
        setIsBulkModalOpen,
        productToDelete,
        setProductToDelete,
        handleDeleteClick,
        confirmDelete,
    } = useAdminProductsPage();

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return <div className="text-center py-20 text-zinc-400">Загрузка товаров...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Заголовок + кнопки */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Управление товарами</h1>
                    <p className="text-zinc-400 mt-1 text-sm sm:text-base">
                        Всего товаров: {filteredProducts.length}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl font-medium transition-colors text-sm sm:text-base"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Импорт из Excel</span>
                    </button>

                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl text-sm sm:text-base"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="hidden sm:inline">Загрузить фото</span>
                    </button>
                </div>
            </div>

            {/* Поиск */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Поиск по названию, бренду или OEM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-3.5 rounded-3xl focus:outline-none focus:border-blue-600 text-base"
                />
            </div>

            {/* Мобильные карточки */}
            <div className="lg:hidden space-y-4">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
                    >
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <ProductImage
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    size={80}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold leading-tight text-base line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-zinc-400 text-sm mt-1">{product.brand}</p>
                                <p className="font-mono text-xs text-zinc-500 mt-0.5">
                                    {product.oem}
                                </p>

                                <div className="mt-3 flex items-baseline justify-between">
                                    <p className="text-xl font-semibold">
                                        {product.price.toLocaleString("ru-RU")} ₽
                                    </p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        product.stock > 5
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : product.stock > 0
                                                ? "bg-amber-500/10 text-amber-500"
                                                : "bg-red-500/10 text-red-500"
                                    }`}>
                                        {product.stock} шт.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => {
                                    setEditingProduct(product);
                                    setIsEditModalOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl text-blue-500 transition"
                            >
                                <Edit2 className="w-5 h-5" />
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDeleteClick(product.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl text-red-500 transition"
                            >
                                <Trash2 className="w-5 h-5" />
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Таблица для десктопа */}
            <div className="hidden lg:block bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="text-left py-5 px-8 font-medium text-zinc-400 w-20">Фото</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Название</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Бренд</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">OEM</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Цена</th>
                        <th className="text-left py-5 px-8 font-medium text-zinc-400">Остаток</th>
                        <th className="w-28"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="py-5 px-8">
                                <ProductImage src={product.images?.[0]} alt={product.name} size={56} />
                            </td>
                            <td className="py-5 px-8 font-medium line-clamp-2 pr-6">{product.name}</td>
                            <td className="py-5 px-8 text-zinc-400">{product.brand}</td>
                            <td className="py-5 px-8 text-zinc-400 font-mono text-sm">{product.oem}</td>
                            <td className="py-5 px-8 font-semibold">
                                {product.price.toLocaleString("ru-RU")} ₽
                            </td>
                            <td className="py-5 px-8">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        product.stock > 5 ? "bg-emerald-500/10 text-emerald-500" :
                                            product.stock > 0 ? "bg-amber-500/10 text-amber-500" :
                                                "bg-red-500/10 text-red-500"
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
                                        className="p-3 hover:bg-zinc-800 rounded-xl text-blue-500"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product.id)}
                                        className="p-3 hover:bg-zinc-800 rounded-xl text-red-500"
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
                        Ничего не найдено
                    </div>
                )}
            </div>

            {/* Модалки */}
            <ImportProductsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                }}
                product={editingProduct}
            />
            <BulkPhotoUploadModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} />

            {/* Подтверждение удаления товара */}
            {productToDelete && (
                <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-3xl p-8 max-w-md w-full">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="text-red-500 mt-1" size={32} />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Удалить товар?</h3>
                                <p className="text-zinc-400">
                                    Это действие нельзя отменить. Товар и все связанные данные будут удалены.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="flex-1 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-800 font-medium"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-semibold"
                            >
                                Да, удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}