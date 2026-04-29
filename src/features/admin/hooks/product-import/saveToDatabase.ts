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
            const { error } = await supabase.from("products").insert(toAdd);
            if (error) throw error;
            results.added = toAdd.length;
        }

        // 2. Обновление товаров + защита фото + автоприкрепление из Storage
        if (toUpdate.length > 0) {
            const oems = [...toAdd, ...toUpdate].map(p => p.oem);

            // Получаем текущие данные (фото) из базы
            const { data: existingData } = await supabase
                .from("products")
                .select("oem, images")
                .in("oem", oems);

            const existingMap = new Map(existingData?.map(item => [item.oem, item.images || []]) || []);

            // === АВТОМАТИЧЕСКОЕ ПРИКРЕПЛЕНИЕ ФОТО ИЗ STORAGE ===
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

            // Обогащаем товары
            const finalUpdate = [...toAdd, ...toUpdate].map(product => {
                const oldImages = existingMap.get(product.oem) || [];
                const newStorageImages = storageMap.get(product.oem) || [];

                return {
                    ...product,
                    images: [...new Set([...oldImages, ...newStorageImages])]
                };
            });

            // Сохраняем
            const { error } = await supabase
                .from("products")
                .upsert(finalUpdate, { onConflict: "oem" });

            if (error) throw error;
            results.updated = toUpdate.length;
        }

        console.log(`✅ Импорт завершён. Фото автоматически приклеены из Storage.`);
    } catch (err: any) {
        console.error("💥 Ошибка сохранения:", err);
        throw new Error(err.message || "Не удалось сохранить товары");
    }

    return results;
}