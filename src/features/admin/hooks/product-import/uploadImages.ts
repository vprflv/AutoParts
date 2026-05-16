// src/features/admin/hooks/product-import/uploadImages.ts
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export async function uploadImage(
    file: File,
    oem: string,
    index: number
): Promise<string | null> {
    try {
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${oem.toUpperCase()}_${index + 1}.${fileExt}`;

        console.log(`📤 Заменяем фото: ${fileName}`);

        // 1. Сначала пытаемся удалить старый файл (если существует)
        await supabase.storage
            .from("product-images")
            .remove([fileName])
            .catch(() => {}); // игнорируем ошибку, если файла не было

        // 2. Загружаем новый файл
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error(`❌ Ошибка загрузки ${fileName}:`, error);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);

        console.log(`✅ Фото успешно заменено: ${fileName}`);
        return urlData.publicUrl;
    } catch (err) {
        console.error("Ошибка при замене изображения:", err);
        return null;
    }
}