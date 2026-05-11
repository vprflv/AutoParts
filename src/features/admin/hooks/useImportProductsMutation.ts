import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';
import {importProducts} from "@/features/admin/actions/productImportActions";

export function useImportProductsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (products: any[]) => {
            const result = await importProducts(products);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });

            toast.success(
                `Импорт успешно завершён!\n` +
                `✅ Добавлено: ${data.added} | ` +
                `🔄 Обновлено: ${data.updated}`
            );
        },

        onError: (err: any) => {
            toast.error(err.message || "Ошибка импорта товаров");
        },
    });
}