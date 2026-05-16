import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {bulkPhotoUpload} from "@/features/admin/actions/adminProductActions";


export function useBulkPhotoUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkPhotoUpload,

        onSuccess: (results) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });

            toast.success(
                `Загрузка фото завершена!\n` +
                `✅ Обновлено товаров: ${results.updated}\n` +
                `⏭ Пропущено: ${results.skipped}`
            );
        },

        onError: (err: any) => {
            toast.error(err.message || "Ошибка при загрузке фотографий");
        },
    });
}