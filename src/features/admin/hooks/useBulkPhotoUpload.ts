import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { uploadProductImages } from '../actions/uploadProductImages';

export function useBulkPhotoUpload() {
    return useMutation({
        mutationFn: async (files: File[]) => {
            if (files.length === 0) throw new Error("Нет файлов для загрузки");

            const total = files.length;
            const toastId = toast.loading(`Загрузка фото: 0/${total}`);

            const chunkSize = 4;
            let successTotal = 0;
            let failedTotal = 0;
            let notFoundTotal = 0;
            const allErrors: string[] = [];
            const allNotFoundOems: string[] = [];
            const allUploadedUrls: string[] = [];

            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                const current = Math.min(i + chunkSize, total);

                toast.loading(`Загрузка фото: ${current}/${total}`, { id: toastId });

                const result = await uploadProductImages(chunk);

                successTotal += result.success || 0;
                failedTotal += result.failed || 0;
                notFoundTotal += result.notFound || 0;

                if (result.errors) allErrors.push(...result.errors);
                if (result.notFoundOems) allNotFoundOems.push(...result.notFoundOems);
                if (result.uploadedUrls) allUploadedUrls.push(...result.uploadedUrls);
            }

            toast.dismiss(toastId);

            return {
                success: successTotal,
                failed: failedTotal,
                notFound: notFoundTotal,
                total,
                errors: allErrors,
                notFoundOems: allNotFoundOems,
                uploadedUrls: allUploadedUrls,
            };
        },

        onSuccess: (result) => {
            if (result.success > 0) {
                toast.success(`✅ Загружено ${result.success} из ${result.total} фото`, {
                    duration: 5000
                });
            }

            if (result.notFound && result.notFound > 0) {
                toast.error(`⚠️ Товары не найдены для ${result.notFound} фото`, {
                    duration: 7000
                });
            }

            if (result.failed && result.failed > (result.notFound || 0)) {
                toast.error(`❌ Ошибка загрузки ${result.failed - (result.notFound || 0)} фото`, {
                    duration: 6000
                });
            }

            return result;
        },

        onError: (error: any) => {
            toast.error(`Критическая ошибка: ${error.message || "Неизвестная ошибка"}`, {
                duration: 8000
            });
        },
    });
}