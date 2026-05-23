import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Product } from "@/src/types";
import { updateProduct } from "@/features/admin/actions/adminProductActions";
import { deleteProductImageAction } from "@/features/admin/actions/adminProductActions"; // ← добавь импорт
import { uploadImage } from "@/features/admin/hooks/product-import/uploadImages";
import {uploadSingleImageAction} from "@/features/admin/actions/uploadSingleImage";

export function useEditProduct(product: Product | null) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<Partial<Product>>({});
    const [images, setImages] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Товар успешно обновлён!");
        },
    });

    // Инициализация
    useEffect(() => {
        if (product) {
            setFormData({ ...product });
            setImages([...(product.images || [])]);
        }
    }, [product]);

    // Удаление фото с очисткой Storage
    const removeImage = useCallback(async (index: number) => {
        if (!product || !images[index]) return;

        const imageUrl = images[index];

        if (!confirm("Удалить это фото полностью (из хранилища и из товара)?")) {
            return;
        }

        setIsUploading(true);

        try {
            await deleteProductImageAction(product.id, imageUrl);

            // Обновляем локальное состояние
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);

            toast.success("Фото удалено");
        } catch (error: any) {
            toast.error(error.message || "Не удалось удалить фото");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }, [product, images]);

    const handleFilesSelect = useCallback(async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0 || !product) return;

        setIsUploading(true);

        try {
            const newUrls: string[] = [];

            for (const file of selectedFiles) {
                const url = await uploadSingleImageAction(file, product.oem);
                if (url) newUrls.push(url);
            }

            setImages(prev => [...prev, ...newUrls]);
            toast.success(`Загружено ${newUrls.length} фото`);
        } catch (error: any) {
            toast.error(error.message || "Ошибка загрузки фото");
        } finally {
            setIsUploading(false);
        }
    }, [product]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
        handleFilesSelect(files);
    }, [handleFilesSelect]);

    const updateField = useCallback((field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = async () => {
        if (!formData.name?.trim() || !formData.brand?.trim() || !formData.oem?.trim()) {
            toast.error("Название, Бренд и OEM — обязательные поля");
            return false;
        }

        setIsSaving(true);

        const dataToSave = {
            ...formData,
            images, // ← передаём актуальный массив
            applicability: Array.isArray(formData.applicability)
                ? formData.applicability
                : typeof formData.applicability === "string"
                    ? formData.applicability.split(",").map(s => s.trim()).filter(Boolean)
                    : [],
        };

        try {
            await updateMutation.mutateAsync({
                id: product!.id,
                data: dataToSave,
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        images,
        isSaving,
        isUploading,
        updateField,
        handleSave,
        removeImage,
        handleDrop,
        handleFilesSelect,
    };
}