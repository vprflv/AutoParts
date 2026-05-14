// src/features/admin/hooks/useEditProduct.ts
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Product } from "@/src/types";
import { updateProduct } from "@/features/admin/actions/adminProductActions";
import { uploadImage } from "@/features/admin/hooks/product-import/uploadImages";

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
        onError: (err: any) => toast.error(err.message || "Ошибка обновления"),
    });

    // Инициализация
    useEffect(() => {
        if (product) {
            setFormData({ ...product });
            setImages([...(product.images || [])]);
        }
    }, [product]);

    const handleFilesSelect = useCallback(async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0 || !product) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const url = await uploadImage(selectedFiles[i], product.oem, images.length + i);
            if (url) newUrls.push(url);
        }

        setImages(prev => [...prev, ...newUrls]);
        setIsUploading(false);
        toast.success(`Загружено ${newUrls.length} фото`);
    }, [product, images.length]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
        handleFilesSelect(files);
    }, [handleFilesSelect]);

    const removeImage = useCallback((index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateField = useCallback((field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = async () => {
        if (!formData.name?.trim() || !formData.brand?.trim() || !formData.oem?.trim()) {
            toast.error("Название, Бренд и OEM — обязательные поля");
            return false;
        }

        setIsSaving(true);

        const applicability = Array.isArray(formData.applicability)
            ? formData.applicability
            : typeof formData.applicability === "string"
                ? formData.applicability.split(",").map(s => s.trim()).filter(Boolean)
                : [];

        const dataToSave = { ...formData, images, applicability };

        try {
            await updateMutation.mutateAsync({ id: product!.id, data: dataToSave });
            return true;
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