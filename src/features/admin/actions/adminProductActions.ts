"use server";

import { prisma } from "@/src/lib/prisma";
import { Product } from "@/src/types";
import {createClient} from "@/lib/supabase/client";
import {createServerClientFn} from "@/lib/supabase/server";

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
        const products = await prisma.product.findMany({
            select: { oem: true, images: true }
        });

        const productMap = new Map(products.map(p => [p.oem.toUpperCase(), p]));

        const results = { updated: 0, skipped: 0, errors: 0 };
        const filesByOem = new Map<string, File[]>();

        // Группировка файлов
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

        // Обработка
        for (const [oem, groupFiles] of filesByOem) {
            try {
                const currentProduct = productMap.get(oem);
                let currentImages: string[] = currentProduct?.images || [];

                const uploadedUrls: string[] = [];

                for (const file of groupFiles) {
                    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
                    const safeOem = oem.replace(/[^A-Z0-9]/g, '');
                    const fileName = `${safeOem}_${file.name}`;

                    const { data, error } = await supabase.storage
                        .from("product-images")
                        .upload(fileName, file, {
                            cacheControl: "3600",
                            upsert: true,
                        });

                    if (error) {
                        console.error(`Upload error for ${file.name}:`, error);
                        continue;
                    }

                    const { data: urlData } = supabase.storage
                        .from("product-images")
                        .getPublicUrl(data.path);

                    uploadedUrls.push(urlData.publicUrl);
                }

                // === Очистка + объединение ===
                const allImages = [...uploadedUrls, ...currentImages];

                const cleanImages = allImages
                    .filter((url): url is string =>
                        typeof url === "string" &&
                        url.trim() !== "" &&
                        !url.includes("undefined") &&
                        !url.includes("null") &&
                        url.startsWith("http")
                    )
                    .filter((url, index, self) => self.indexOf(url) === index) // убираем дубли
                    .slice(0, 10); // максимум 10 фото

                // Обновляем в Prisma
                await prisma.product.update({
                    where: { oem },
                    data: { images: cleanImages }
                });

                results.updated++;
            } catch (err) {
                console.error(`Ошибка обработки ${oem}:`, err);
                results.errors++;
            }
        }

        const duration = Date.now() - startTime;
        console.log(`📸 Bulk photo upload completed in ${duration}ms | Updated: ${results.updated}`);

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
