// src/features/admin/hooks/product-import/saveToDatabase.ts
import { createClient } from "@/src/lib/supabase/client";
import { ImportProduct } from "./types";

const supabase = createClient();

export async function saveToDatabase(toAdd: ImportProduct[], toUpdate: ImportProduct[]) {
    const results = { added: 0, updated: 0, failed: 0 };

    try {
        console.log(`💾 Сохранение: ${toAdd.length} новых, ${toUpdate.length} обновлений`);

        // 1. Новые товары
        if (toAdd.length > 0) {
            const { error } = await supabase
                .from("products")
                .insert(toAdd);

            if (error) throw error;
            results.added = toAdd.length;
        }

        // 2. Обновление товаров
        if (toUpdate.length > 0) {
            const oems = [...toAdd, ...toUpdate].map(p => p.oem);

            // Получаем текущие изображения
            const { data: existingData } = await supabase
                .from("products")
                .select("oem, images")
                .in("oem", oems);

            const existingMap = new Map(existingData?.map(item => [item.oem, item.images || []]) || []);

            // Автоматическое прикрепление фото из Storage
            const { data: storageFiles } = await supabase.storage
                .from('product-images')
                .list('', { limit: 1000 });

            const storageMap = new Map<string, string[]>();

            storageFiles?.forEach(file => {
                const fileName = file.name.toUpperCase();
                for (const oem of oems) {
                    if (fileName.startsWith(oem.toUpperCase())) {
                        const publicUrl = supabase.storage
                            .from('product-images')
                            .getPublicUrl(file.name).data.publicUrl;

                        if (!storageMap.has(oem)) storageMap.set(oem, []);
                        storageMap.get(oem)!.push(publicUrl);
                        break;
                    }
                }
            });

            // Подготовка финальных данных для upsert
            const finalUpdate = [...toAdd, ...toUpdate].map(product => {
                const oldImages = existingMap.get(product.oem) || [];
                const newStorageImages = storageMap.get(product.oem) || [];

                return {
                    ...product,
                    images: Array.from(new Set([...oldImages, ...newStorageImages])),
                    // Явно передаём новые поля
                    description: product.description || null,
                    specifications: product.specifications || null,
                };
            });

            const { error } = await supabase
                .from("products")
                .upsert(finalUpdate, {
                    onConflict: "oem",
                    ignoreDuplicates: false
                });

            if (error) throw error;
            results.updated = toUpdate.length;
        }

        console.log(`✅ Импорт успешно завершён. Новые поля (description, specifications) сохранены.`);
    } catch (err: any) {
        console.error("💥 Ошибка сохранения:", err);
        throw new Error(err.message || "Не удалось сохранить товары в базу");
    }

    return results;
}