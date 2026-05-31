"use server";

import { prisma } from "@/src/lib/prisma";
import { createServerClientFn } from "@/src/lib/supabase/server";
import { getCurrentAdmin } from "@/features/admin/lib/getCurrentAdmin";
import { Prisma } from "@prisma/client";
export async function uploadProductImages(files: File[]) {
    const supabase = await createServerClientFn();
    const admin = await getCurrentAdmin().catch(() => null);

    let success = 0;
    let failed = 0;
    let notFound = 0;
    const errors: string[] = [];
    const notFoundOems: string[] = [];
    const uploadedUrls: string[] = [];

    // === ДОБАВЛЕНО: сохранение истории загрузки фото ===
    const startTime = Date.now();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await processSingleImage(supabase, file, i);

        const oem = extractOEM(file.name);

        if (result.success) {
            success++;
            if (result.url) uploadedUrls.push(result.url);
        } else {
            failed++;
            if (result.error?.includes("не найден")) {
                notFound++;
                notFoundOems.push(oem || file.name);
            }
            errors.push(`❌ ${file.name} (OEM: ${oem || '—'}): ${result.error}`);
        }
    }

    const duration = Date.now() - startTime;

    // === ДОБАВЛЕНО: запись в importHistory ===
    await prisma.importHistory.create({
        data: {
            userId: admin?.id || "system",
            type: "photos",
            fileName: `bulk-upload-${new Date().toISOString().slice(0, 10)}`,
            totalRows: files.length,
            added: success,
            updated: 0,
            skipped: 0,
            failed: failed,
            errors: errors.length > 0 ? errors : Prisma.JsonNull,
            resultData: {
                durationMs: duration,
                notFound,
                notFoundOems,
            },
        },
    });

    return {
        success,
        failed,
        notFound,
        total: files.length,
        notFoundOems,
        uploadedUrls,
        errors: errors.length > 0 ? errors : undefined,
    };
}

function extractOEM(fileName: string): string | null {
    const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
    const firstPart = nameWithoutExt.split('_')[0];
    return firstPart ? firstPart.trim().toUpperCase() : null;
}

async function processSingleImage(
    supabase: any,
    file: File,
    index: number
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const oem = extractOEM(file.name);
        if (!oem) return { success: false, error: "Не удалось извлечь OEM" };

        const product = await prisma.product.findUnique({
            where: { oem },
            select: { images: true }
        });

        if (!product) return { success: false, error: `Товар с OEM ${oem} не найден` };

        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const storageFileName = `${oem}_${timestamp}_${index + 1}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(storageFileName, file, {
                upsert: true,
                contentType: file.type || "image/jpeg",
            });

        if (uploadError) throw new Error(`Supabase: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);

        if (!urlData?.publicUrl) throw new Error("Не удалось получить URL");

        await prisma.$executeRaw`
            UPDATE "products"
            SET images = array_append(images, ${urlData.publicUrl}::text),
                "updatedAt" = NOW()
            WHERE oem = ${oem};
        `;

        return { success: true, url: urlData.publicUrl };

    } catch (err: any) {
        console.error(`Ошибка ${file.name}:`, err);
        return { success: false, error: err.message };
    }
}