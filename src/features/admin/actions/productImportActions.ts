"use server";

import { prisma } from "@/src/lib/prisma";
import {generateSearchText} from "@/app/admin/utils/generateSearchText";


export async function importProducts(products: any[]) {
    const startTime = Date.now();

    try {
        // Подготавливаем данные
        const upsertData = products.map(p => {
            const oem = p.oem?.toString().trim().toUpperCase();

            const crossNumbersArray = typeof p.crossNumbers === 'string'
                ? p.crossNumbers.split(';').map((s: string) => s.trim()).filter(Boolean)
                : Array.isArray(p.crossNumbers) ? p.crossNumbers : [];

            return {
                oem,
                name: p.name?.toString().trim() || "",
                brand: p.brand?.toString().trim() || "",
                price: parseFloat(p.price) || 0,
                stock: parseInt(p.stock) || 0,
                category: p.category?.toString().trim() || "Разное",
                description: p.description?.toString().trim() || null,
                images: Array.isArray(p.images) ? p.images : [],
                applicability: Array.isArray(p.applicability) ? p.applicability : [],
                crossNumbers: crossNumbersArray,
                specifications: p.specifications
                    ? (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications)
                    : {},
                searchText: generateSearchText(p),
            };
        }).filter(p => p.oem && p.name && p.brand); // отсеиваем кривые строки

        // === Быстрый способ посчитать added / updated ===
        const oems = upsertData.map(p => p.oem);

        const existingCount = await prisma.product.count({
            where: { oem: { in: oems } }
        });

        const result = await prisma.product.createMany({
            data: upsertData,
            skipDuplicates: true,
        });

        const added = result.count;
        const updated = existingCount; // все, что уже было — считаем как обновления (т.к. новые не создались)

        const duration = Date.now() - startTime;

        console.log(`✅ Импорт завершён за ${duration}мс | Добавлено: ${added} | Обновлено: ${updated}`);

        return {
            success: true,
            added,
            updated,
            total: products.length,
            duration
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return {
            success: false,
            error: error.message || "Ошибка импорта товаров",
            added: 0,
            updated: 0
        };
    }
}