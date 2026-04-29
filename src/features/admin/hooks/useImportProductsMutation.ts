// src/features/admin/hooks/useImportProductsMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProductImport } from './product-import/useProductImport';
import { toast } from 'react-hot-toast';

export function useImportProductsMutation() {
    const queryClient = useQueryClient();
    const { parseImportFile, saveToDatabase } = useProductImport();

    return useMutation({
        mutationFn: async ({ excelFile, imageFiles }: {
            excelFile: File;
            imageFiles?: File[]
        }) => {
            const preview = await parseImportFile(excelFile);
            const result = await saveToDatabase(preview.toAdd, preview.toUpdate);
            return { preview, result };
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });

            toast.success(
                `Импорт успешно завершён!\n` +
                `✅ Добавлено: ${data.result.added} | ` +
                `🔄 Обновлено: ${data.result.updated}`
            );
        },

        onError: (err: any) => {
            toast.error(err.message || "Ошибка импорта");
        },
    });
}