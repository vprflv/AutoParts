// src/features/admin/hooks/useAdminProductsPage.ts
import { useState } from "react";
import { useAdminProducts } from "./useAdminProducts";
import { Product } from "@/src/types";
import {toast} from "react-hot-toast";

export function useAdminProductsPage() {
    const { products, isLoading, deleteProduct } = useAdminProducts();

    const [searchTerm, setSearchTerm] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.oem.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete);
            // toast.success("Товар успешно удалён"); // можно раскомментировать
        } catch (err) {
            toast.error("Не удалось удалить товар");
        } finally {
            setProductToDelete(null);
        }
    };

    return {
        products,
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
    };
}