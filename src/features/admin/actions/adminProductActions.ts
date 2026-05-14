"use server";

import { prisma } from "@/src/lib/prisma";
import { Product } from "@/src/types";
import {createClient} from "@/lib/supabase/client";
import {createServerClientFn} from "@/lib/supabase/server";
import {generateSearchText} from "@/app/admin/utils/generateSearchText";

export async function getAdminProducts(): Promise<Product[]> {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error("Ошибка получения товаров для админки:", error);
        return [];
    }
}

export async function deleteProductAction(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error("Ошибка удаления товара:", error);
        throw error;
    }
}

/**
 * Массовая загрузка фото + очистка невалидных ссылок
 */
export async function bulkPhotoUpload(files: File[]) {
    if (files.length === 0) throw new Error("Нет файлов для загрузки");

    const startTime = Date.now();
    const supabase = createClient();

    try {
        // Получаем все товары один раз
        const products = await prisma.product.findMany({
            select: { oem: true, images: true }
        });

        const productMap = new Map(
            products.map(p => [p.oem.toUpperCase(), p])
        );

        const results = { updated: 0, skipped: 0, errors: 0 };
        const filesByOem = new Map<string, File[]>();

        // === Группировка файлов по OEM ===
        for (const file of files) {
            const fileNameUpper = file.name.toUpperCase();
            let matchedOem: string | null = null;

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

        // === Параллельная загрузка с ограничением concurrency ===
        const CONCURRENCY = 6; // можно поднять до 8-10, если Supabase выдерживает

        const processGroup = async ([oem, groupFiles]: [string, File[]]) => {
            try {
                const currentProduct = productMap.get(oem);
                let currentImages: string[] = Array.isArray(currentProduct?.images)
                    ? currentProduct.images
                    : [];

                const uploadPromises = groupFiles.map(async (file, index) => {
                    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
                    const safeOem = oem.replace(/[^A-Z0-9-]/g, '');
                    const fileName = `${safeOem}_${Date.now()}_${index}.${fileExt}`;

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

                    return urlData.publicUrl;
                });

                const uploadedUrls = (await Promise.allSettled(uploadPromises))
                    .filter(r => r.status === 'fulfilled')
                    .map(r => (r as PromiseFulfilledResult<string>).value);

                // Объединяем + чистим
                const allImages = [...uploadedUrls, ...currentImages];
                const cleanImages = [...new Set(allImages)]
                    .filter(url => typeof url === "string" && url.startsWith("http"))
                    .slice(0, 10); // максимум 10 фото

                await prisma.product.update({
                    where: { oem },
                    data: { images: cleanImages }
                });

                results.updated++;
            } catch (err) {
                console.error(`Ошибка обработки OEM ${oem}:`, err);
                results.errors++;
            }
        };

        // Запускаем с ограничением параллельности
        const groups = Array.from(filesByOem.entries());
        for (let i = 0; i < groups.length; i += CONCURRENCY) {
            const batch = groups.slice(i, i + CONCURRENCY);
            await Promise.all(batch.map(processGroup));
        }

        const duration = Date.now() - startTime;
        console.log(`📸 Bulk photo upload завершён за ${duration}мс | Обновлено: ${results.updated} | Пропущено: ${results.skipped}`);

        return results;

    } catch (error: any) {
        console.error("bulkPhotoUpload error:", error);
        throw error;
    }
}

export async function deletePhotoAction(fileName: string) {
    if (!fileName) throw new Error("Имя файла не указано");

    try {
        const supabase = await createServerClientFn();   // ← используем стандартное имя

        if (!supabase) {
            throw new Error("Не удалось создать Supabase клиент");
        }

        // 1. Получаем публичный URL
        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // 2. Удаляем из Storage
        const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove([fileName]);

        if (storageError) {
            console.warn("Storage delete warning:", storageError);
        }

        // 3. Очищаем из товаров
        const productsWithPhoto = await prisma.product.findMany({
            where: {
                images: { has: publicUrl }
            },
            select: { id: true, images: true, oem: true }
        });

        let cleaned = 0;

        for (const product of productsWithPhoto) {
            const newImages = product.images.filter((url: string) => url !== publicUrl);

            await prisma.product.update({
                where: { id: product.id },
                data: { images: newImages }
            });

            cleaned++;
        }

        return {
            success: true,
            cleaned,
            message: `Фото "${fileName}" удалено и очищено из ${cleaned} товаров`
        };

    } catch (error: any) {
        console.error("deletePhotoAction error:", error);
        throw new Error(error.message || "Не удалось удалить фото");
    }
}


export async function updateProduct(id: string, data: any) {
    try {
        const searchText = generateSearchText(data);

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                searchText,                    // ← гарантированно обновляем
                applicability: Array.isArray(data.applicability)
                    ? data.applicability
                    : [],
            },
        });

        return { success: true, product: updated };
    } catch (error: any) {
        console.error("Update product error:", error);
        throw new Error(error.message || "Не удалось обновить товар");
    }
}