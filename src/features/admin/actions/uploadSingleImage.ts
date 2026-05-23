"use server";

import { prisma } from "@/src/lib/prisma";
import { createServerClientFn } from "@/src/lib/supabase/server";

export async function uploadSingleImageAction(file: File, oem: string) {
    if (!file || !oem) throw new Error("Не передан файл или OEM");

    const supabase = await createServerClientFn();

    try {
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const fileName = `${oem.toUpperCase()}_${timestamp}.${fileExt}`;

        // Загрузка в Supabase
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, file, {
                upsert: true,
                contentType: file.type || "image/jpeg",
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);

        if (!urlData?.publicUrl) throw new Error("Не удалось получить URL");

        // Привязка к товару
        await prisma.product.update({
            where: { oem: oem.toUpperCase() },
            data: {
                images: {
                    push: urlData.publicUrl,
                },
            },
        });

        return urlData.publicUrl;

    } catch (err: any) {
        console.error("uploadSingleImageAction error:", err);
        throw new Error(err.message || "Не удалось загрузить фото");
    }
}