"use server";

import { prisma } from "@/src/lib/prisma";

export async function importProducts(products: any[]) {
    try {
        let added = 0;
        let updated = 0;

        // Используем upsert — это оптимально для импорта
        for (const p of products) {
            const crossNumbersArray = typeof p.crossNumbers === 'string'
                ? p.crossNumbers.split(';').map((s: string) => s.trim()).filter(Boolean)
                : p.crossNumbers || [];

            const result = await prisma.product.upsert({
                where: { oem: p.oem },
                update: {
                    name: p.name,
                    price: p.price,
                    brand: p.brand,
                    category: p.category || null,
                    stock: p.stock || 0,
                    images: p.images || [],
                    applicability: p.applicability || [],
                    crossNumbers: crossNumbersArray,
                    description: p.description || null,
                    specifications: p.specifications || null,
                },
                create: {
                    name: p.name,
                    oem: p.oem,
                    price: p.price,
                    brand: p.brand,
                    category: p.category || null,
                    stock: p.stock || 0,
                    images: p.images || [],
                    applicability: p.applicability || [],
                    crossNumbers: crossNumbersArray,
                    description: p.description || null,
                    specifications: p.specifications || null,
                },
            });

            // Считаем, было ли обновление или создание
            if (result.createdAt.getTime() === result.updatedAt.getTime()) {
                added++;
            } else {
                updated++;
            }
        }

        return {
            success: true,
            added,
            updated,
            total: products.length
        };
    } catch (error: any) {
        console.error("Import error:", error);
        return {
            success: false,
            error: error.message || "Ошибка импорта товаров"
        };
    }
}