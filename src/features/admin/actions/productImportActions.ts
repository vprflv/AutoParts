"use server";

import { prisma } from "@/src/lib/prisma";

export async function importProducts(products: any[]) {
    const startTime = Date.now();

    try {
        // Подготавливаем данные один раз
        const upsertData = products.map(p => {
            const crossNumbersArray = typeof p.crossNumbers === 'string'
                ? p.crossNumbers.split(';').map((s: string) => s.trim()).filter(Boolean)
                : Array.isArray(p.crossNumbers) ? p.crossNumbers : [];

            return {
                oem: p.oem?.toString().trim(),
                name: p.name?.toString().trim(),
                brand: p.brand?.toString().trim(),
                price: parseFloat(p.price) || 0,
                stock: parseInt(p.stock) || 0,
                category: p.category?.toString().trim() || null,
                description: p.description?.toString().trim() || null,
                images: Array.isArray(p.images) ? p.images : [],
                applicability: Array.isArray(p.applicability) ? p.applicability : [],
                crossNumbers: crossNumbersArray,
                specifications: p.specifications
                    ? (typeof p.specifications === 'string'
                        ? JSON.parse(p.specifications)
                        : p.specifications)
                    : null,
            };
        });

        // Один большой запрос вместо 100 мелких
        const result = await prisma.product.createMany({
            data: upsertData,
            skipDuplicates: true,   // пропускает товары с уже существующим OEM
        });

        const duration = Date.now() - startTime;

        console.log(`✅ Импорт завершён за ${duration}мс | Добавлено: ${result.count} товаров`);

        return {
            success: true,
            added: result.count,
            updated: 0,                    // createMany не обновляет, только создаёт
            total: products.length,
            duration
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return {
            success: false,
            error: error.message || "Ошибка импорта товаров"
        };
    }
}