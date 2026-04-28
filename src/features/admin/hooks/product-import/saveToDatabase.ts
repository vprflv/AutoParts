// src/features/admin/hooks/product-import/saveToDatabase.ts
import { createClient } from "@/src/lib/supabase/client";
import { ImportProduct } from "./types";

const supabase = createClient();

export async function saveToDatabase(
    toAdd: ImportProduct[],
    toUpdate: ImportProduct[]
) {
    const results = { added: 0, updated: 0, failed: 0 };

    try {
        // 1. Новые товары
        if (toAdd.length > 0) {
            const { error } = await supabase
                .from("products")
                .insert(toAdd);

            if (error) throw error;
            results.added = toAdd.length;
        }

        // 2. Обновление товаров + подтягивание фото из Storage
        if (toUpdate.length > 0) {
            const oems = toUpdate.map(p => p.oem);

            // Получаем текущие данные товаров (особенно images)
            const { data: existingProducts } = await supabase
                .from("products")
                .select("oem, images")
                .in("oem", oems);

            const existingMap = new Map(
                existingProducts?.map(p => [p.oem, p.images || []]) || []
            );

            // Обогащаем товары фото из Storage, если в прайсе их нет
            const enrichedToUpdate = toUpdate.map(product => {
                const currentImages = existingMap.get(product.oem) || [];

                return {
                    ...product,
                    images: product.images && product.images.length > 0
                        ? product.images                    // если в Excel пришли фото — используем их
                        : currentImages                     // иначе оставляем старые
                };
            });

            const { error } = await supabase
                .from("products")
                .upsert(enrichedToUpdate, { onConflict: "oem" });

            if (error) throw error;
            results.updated = toUpdate.length;
        }
    } catch (err: any) {
        console.error("💥 Ошибка сохранения:", err);
        throw new Error(err.message || "Не удалось сохранить товары");
    }

    return results;
}