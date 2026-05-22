import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { uploadProductImages } from '../actions/uploadProductImages';

export function useBulkPhotoUpload() {
    return useMutation({
        mutationFn: async (files: File[]) => {
            if (files.length === 0) throw new Error("Нет файлов для загрузки");

            const total = files.length;
            const toastId = toast.loading(`Загрузка фото: 0/${total}`);

            // Разбиваем на чанки по 4 файла для обновления прогресса
            const chunkSize = 4;
            let successTotal = 0;
            let failedTotal = 0;

            for (let i = 0; i < files.length; i += chunkSize) {
                const chunk = files.slice(i, i + chunkSize);
                const current = i + chunk.length;

                // Обновляем тост
                toast.loading(`Загрузка фото: ${current}/${total}`, { id: toastId });

                const result = await uploadProductImages(chunk);

                successTotal += result.success;
                failedTotal += result.failed;
            }

            toast.dismiss(toastId);

            // Финальное уведомление
            if (successTotal > 0) {
                toast.success(`✅ Успешно загружено ${successTotal} из ${total} фото`, { duration: 6000 });
            }
            if (failedTotal > 0) {
                toast.error(`❌ Не удалось загрузить ${failedTotal} фото`, { duration: 6000 });
            }

            return { success: successTotal, failed: failedTotal, total };
        },

        onError: (error: any) => {
            toast.error(`Критическая ошибка: ${error.message}`);
        },
    });
}