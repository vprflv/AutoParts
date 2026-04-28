// src/features/admin/hooks/useBulkPhotoUpload.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/src/lib/supabase/client';
import { toast } from 'react-hot-toast';

const supabase = createClient();

export function useBulkPhotoUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (files: File[]) => {
            if (files.length === 0) throw new Error("Нет файлов");

            const { data: products } = await supabase
                .from("products")
                .select("oem, images");

            if (!products) throw new Error("Не удалось получить товары");

            const productMap = new Map(products.map(p => [p.oem.toUpperCase(), p]));

            const results = { updated: 0, skipped: 0, errors: 0 };

            // Группируем все файлы по OEM
            const filesByOem = new Map<string, File[]>();

            for (const file of files) {
                const fileNameUpper = file.name.toUpperCase();
                let matchedOem = null;

                for (const [oem] of productMap) {
                    if (fileNameUpper.includes(oem)) {
                        matchedOem = oem;
                        break;
                    }
                }

                if (!matchedOem) {
                    results.skipped++;
                    continue;
                }

                if (!filesByOem.has(matchedOem)) filesByOem.set(matchedOem, []);
                filesByOem.get(matchedOem)!.push(file);
            }

            // Обрабатываем каждую группу
            for (const [oem, groupFiles] of filesByOem) {
                try {
                    console.log(`📸 Загружаем ${groupFiles.length} фото для ${oem}`);

                    const uploadedUrls: string[] = [];

                    for (let i = 0; i < groupFiles.length; i++) {
                        const file = groupFiles[i];
                        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
                        const fileName = `${oem}_${i + 1}.${fileExt}`;

                        // Удаляем старое
                        await supabase.storage.from("product-images").remove([fileName]).catch(() => {});

                        const { data, error } = await supabase.storage
                            .from("product-images")
                            .upload(fileName, file, {
                                cacheControl: "3600",
                                upsert: true,
                            });

                        if (error) throw error;

                        const { data: urlData } = supabase.storage
                            .from("product-images")
                            .getPublicUrl(data.path);

                        uploadedUrls.push(urlData.publicUrl);
                    }

                    // Обновляем товар один раз для всей группы
                    const currentProduct = productMap.get(oem);
                    const currentImages = currentProduct?.images || [];

                    const newImages = [...uploadedUrls, ...currentImages]
                        .filter((url, idx, arr) => arr.indexOf(url) === idx) // убираем дубли
                        .slice(0, 10); // максимум 10 фото

                    await supabase
                        .from("products")
                        .update({ images: newImages })
                        .eq("oem", oem);

                    results.updated++;
                } catch (err) {
                    console.error(`Ошибка для ${oem}:`, err);
                    results.errors++;
                }
            }

            return results;
        },

        onSuccess: (results) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });

            toast.success(
                `Загрузка завершена!\n` +
                `✅ Обновлено товаров: ${results.updated}\n` +
                `⏭ Пропущено: ${results.skipped}`
            );
        },

        onError: (err: any) => {
            toast.error(err.message || "Ошибка загрузки");
        },
    });
}