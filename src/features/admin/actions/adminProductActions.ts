"use server";

import { prisma } from "@/src/lib/prisma";
import { Product } from "@/src/types";
import { createServerClientFn } from "@/src/lib/supabase/server";
import { generateSearchText } from "@/features/admin/utils/generateSearchText";
import { toPlain } from "@/lib/utils/toPlain";

export async function getAdminProducts(): Promise<Product[]> {
    try {
        const products = await prisma.product.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });

        return toPlain(products);
    } catch (error) {
        console.error("Ошибка получения товаров для админки:", error);
        return [];
    }
}

// =============================================
// УДАЛЕНИЕ ТОВАРА + ЕГО ФОТО ИЗ STORAGE
// =============================================
export async function deleteProductAction(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { id: true, oem: true, images: true }
        });

        if (!product) throw new Error("Товар не найден");

        const supabase = await createServerClientFn();

        // Удаляем фото из Storage
        if (product.images?.length > 0) {
            const fileNames = product.images
                .map((url: string) => url.split("/").pop())
                .filter((name): name is string => Boolean(name));

            if (fileNames.length > 0) {
                await supabase.storage
                    .from("product-images")
                    .remove(fileNames)
                    .catch(err => console.warn("Storage cleanup warning:", err));
            }
        }

        await prisma.product.delete({ where: { id } });

        console.log(`✅ Товар ${product.oem} и его фото удалены`);

        return { success: true };
    } catch (error: any) {
        console.error("deleteProductAction error:", error);
        throw new Error(error.message || "Не удалось удалить товар");
    }
}

// =============================================
// УДАЛЕНИЕ ОДНОГО ФОТО
// =============================================
export async function deleteProductImageAction(productId: string, imageUrl: string) {
    if (!productId || !imageUrl) {
        throw new Error("Не переданы необходимые данные");
    }

    try {
        const supabase = await createServerClientFn();

        const fileName = imageUrl.split("/").pop();

        if (fileName) {
            await supabase.storage
                .from("product-images")
                .remove([fileName])
                .catch(err => console.warn("Storage delete warning:", err));
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { images: true }
        });

        if (!product) throw new Error("Товар не найден");

        const updatedImages = product.images.filter((url: string) => url !== imageUrl);

        await prisma.product.update({
            where: { id: productId },
            data: { images: updatedImages }
        });

        return { success: true, remaining: updatedImages.length };
    } catch (error: any) {
        console.error("deleteProductImageAction error:", error);
        throw new Error(error.message || "Не удалось удалить фото");
    }
}

// =============================================
// ОБНОВЛЕНИЕ ТОВАРА
// =============================================
export async function updateProduct(id: string, data: any) {
    try {
        const searchText = generateSearchText(data);

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                searchText,
                applicability: Array.isArray(data.applicability)
                    ? data.applicability
                    : typeof data.applicability === "string"
                        ? data.applicability.split(",").map((s: string) => s.trim()).filter(Boolean)
                        : [],
            },
        });

        return {
            success: true,
            product: toPlain(updated)
        };
    } catch (error: any) {
        console.error("Update product error:", error);
        throw new Error(error.message || "Не удалось обновить товар");
    }
}