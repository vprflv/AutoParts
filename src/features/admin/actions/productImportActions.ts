"use server";

import pool from "@/src/lib/db/pg";
import { generateSearchText } from "@/features/admin/utils/generateSearchText";

export async function importProducts(productsInput: any[]) {
    const startTime = Date.now();
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oemsInNewFile = new Set<string>();
        const preparedMap = new Map<string, any>();
        let skipped = 0;

        // Подготовка данных
        for (const p of productsInput) {
            const oem = p.oem?.toString().trim().toUpperCase();

            if (!oem || !p.name?.toString().trim() || !p.brand?.toString().trim()) {
                skipped++;
                continue;
            }

            oemsInNewFile.add(oem);

            const crossNumbers = typeof p.crossNumbers === "string"
                ? p.crossNumbers.split(/[;,|]/).map((s: string) => s.trim().toUpperCase()).filter(Boolean)
                : Array.isArray(p.crossNumbers) ? p.crossNumbers.map((s: any) => s?.toString().trim().toUpperCase()).filter(Boolean) : [];

            const applicability = typeof p.applicability === "string"
                ? p.applicability.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
                : Array.isArray(p.applicability) ? p.applicability : [];

            const specifications = p.specifications
                ? typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications
                : {};

            const id = crypto.randomUUID();

            preparedMap.set(oem, {
                id,
                oem,
                name: p.name.toString().trim(),
                brand: p.brand.toString().trim(),
                price: p.price != null ? String(p.price) : "0",
                stock: parseInt(p.stock as string) || 0,
                category: p.category?.toString().trim() || "Разное",
                description: p.description?.toString().trim() || null,
                applicability,
                crossNumbers,
                specifications,
                searchText: generateSearchText({ name: p.name, oem, brand: p.brand, crossNumbers }),
            });
        }

        const prepared = Array.from(preparedMap.values());

        // 1. Деактивируем товары, которых нет в новом прайсе
        if (oemsInNewFile.size > 0) {
            const deactivatedResult = await client.query(`
                UPDATE "products" 
                SET active = false, "updatedAt" = NOW()
                WHERE oem NOT IN (${Array.from(oemsInNewFile).map((_, i) => `$${i+1}`).join(',')})
                  AND active = true
            `, Array.from(oemsInNewFile));

            console.log(`🔴 Деактивировано товаров: ${deactivatedResult.rowCount}`);
        }

        // 2. Добавляем / обновляем товары из Excel
        if (prepared.length > 0) {
            const valuesPlaceholders = prepared.map((_, idx) => {
                const base = idx * 13;
                return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, 
                         $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, 
                         $${base + 11}, $${base + 12}, $${base + 13}, NOW())`;
            }).join(", ");

            const flatValues = prepared.flatMap(item => [
                item.id, item.oem, item.name, item.brand, item.price, item.stock,
                item.category, item.description, [], // images
                item.applicability, item.crossNumbers, item.specifications, item.searchText
            ]);

            await client.query(`
                INSERT INTO "products" (
                    id, oem, name, brand, price, stock, category, description, images,
                    applicability, "crossNumbers", specifications, "searchText", "updatedAt"
                )
                VALUES ${valuesPlaceholders}
                ON CONFLICT (oem) DO UPDATE SET
                    name = EXCLUDED.name,
                    brand = EXCLUDED.brand,
                    price = EXCLUDED.price,
                    stock = EXCLUDED.stock,
                    category = EXCLUDED.category,
                    description = EXCLUDED.description,
                    applicability = EXCLUDED.applicability,
                    "crossNumbers" = EXCLUDED."crossNumbers",
                    specifications = EXCLUDED.specifications,
                    "searchText" = EXCLUDED."searchText",
                    active = true,                    -- активируем обратно
                    "updatedAt" = NOW()
            `, flatValues);
        }

        await client.query("COMMIT");

        const duration = Date.now() - startTime;

        console.log(`✅ Импорт завершён за ${duration}мс | Обработано: ${prepared.length} | Пропущено: ${skipped}`);

        return {
            success: true,
            added: prepared.length,   
            updated: 0,
            skipped,
            total: productsInput.length,
            duration
        };

    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Import error:", error);
        return { success: false, error: error.message || "Ошибка импорта" };
    } finally {
        client.release();
    }
}