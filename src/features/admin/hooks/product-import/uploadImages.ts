// src/features/admin/hooks/product-import/uploadImages.ts
import { createClient } from "@/src/lib/supabase/client";
import { prisma } from "@/src/lib/prisma";

const supabase = createClient();

export async function uploadImage(
    file: File,
    oem: string,
    index: number
): Promise<string | null> {
    try {
        let fileToUpload = file;

        // Сжатие, если файл большой
        if (file.size > 1.2 * 1024 * 1024) {
            fileToUpload = await compressImage(file, 0.78);
            console.log(`📉 Сжато: ${file.name} | ${file.size / 1024 / 1024}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        }

        const fileExt = fileToUpload.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${oem.toUpperCase()}_${index + 1}.${fileExt}`;

        // Удаляем старое фото
        await supabase.storage.from("product-images").remove([fileName]).catch(() => {});

        // Загружаем новое
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, fileToUpload, {
                cacheControl: "3600",
                upsert: true,
                contentType: fileToUpload.type,
            });

        if (error) {
            console.error(`❌ Ошибка загрузки ${fileName}:`, error);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);

        const publicUrl = urlData.publicUrl;

        // === ПРИВЯЗКА К ТОВАРУ ===
        await prisma.product.update({
            where: { oem: oem.toUpperCase() },
            data: {
                images: {
                    push: publicUrl,        // добавляем в массив
                },
            },
        });

        console.log(`✅ Фото загружено и привязано: ${fileName}`);
        return publicUrl;

    } catch (err) {
        console.error("Ошибка при загрузке изображения:", err);
        return null;
    }
}

/** Сжатие изображения */
async function compressImage(file: File, quality: number = 0.78): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                const MAX_SIZE = 1600;
                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return resolve(file);
                        resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
                    },
                    "image/jpeg",
                    quality
                );
            };
        };
    });
}