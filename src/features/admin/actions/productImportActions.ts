"use server";

import pool from "@/src/lib/db/pg";
import { generateSearchText } from "@/features/admin/utils/generateSearchText";
import { getCurrentAdmin } from "@/features/admin/lib/getCurrentAdmin";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function importProducts(
    productsInput: any[] = [],
    fileName: string = "import.xlsx",
    importErrors: string[] = []
) {
    const startTime = Date.now();
    const client = await pool.connect();
    const errors: string[] = [...importErrors];
    let skipped = 0;

    try {
        const admin = await getCurrentAdmin();

        await client.query("BEGIN");

        const oemsInNewFile = new Set<string>();
        const preparedMap = new Map<string, any>();

        for (let i = 0; i < productsInput.length; i++) {
            const p = productsInput[i];
            const rowNumber = i + 1;

            if (!p || !p.oem) {
                skipped++;
                errors.push(`Строка ${rowNumber}: Пустой товар или отсутствует OEM`);
                continue;
            }

            const oem = p.oem.toString().trim().toUpperCase();

            if (oemsInNewFile.has(oem)) {
                skipped++;
                errors.push(`Строка ${rowNumber}: Дублирующийся OEM ${oem}`);
                continue;
            }

            oemsInNewFile.add(oem);

            const crossNumbers = typeof p.crossNumbers === "string"
                ? p.crossNumbers.split(/[;,|]/).map((s: string) => s.trim().toUpperCase()).filter(Boolean)
                : Array.isArray(p.crossNumbers)
                    ? p.crossNumbers.map((s: any) => s?.toString().trim().toUpperCase()).filter(Boolean)
                    : [];

            const applicability = typeof p.applicability === "string"
                ? p.applicability.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
                : Array.isArray(p.applicability) ? p.applicability : [];

            const specifications = p.specifications
                ? typeof p.specifications === "string"
                    ? JSON.parse(p.specifications)
                    : p.specifications
                : {};

            const id = crypto.randomUUID();

            preparedMap.set(oem, {
                id,
                oem,
                name: p.name?.toString().trim() || "",
                brand: p.brand?.toString().trim() || "Без бренда",
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

        // Деактивация отсутствующих товаров
        if (oemsInNewFile.size > 0) {
            await client.query(`
                UPDATE "products"
                SET active = false, "updatedAt" = NOW()
                WHERE oem NOT IN (${Array.from(oemsInNewFile).map((_, i) => `$${i+1}`).join(',')})
                  AND active = true
            `, Array.from(oemsInNewFile));
        }

        // Запись товаров
        if (prepared.length > 0) {
            const valuesPlaceholders = prepared.map((_, idx) => {
                const base = idx * 13;
                return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, 
                         $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, 
                         $${base + 11}, $${base + 12}, $${base + 13}, NOW())`;
            }).join(", ");

            const flatValues = prepared.flatMap(item => [
                item.id, item.oem, item.name, item.brand, item.price, item.stock,
                item.category, item.description, [], item.applicability,
                item.crossNumbers, item.specifications, item.searchText
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
                                             active = true,
                                             "updatedAt" = NOW()
            `, flatValues);
        }

        await client.query("COMMIT");

        const duration = Date.now() - startTime;

        // Сохранение в историю
        await prisma.importHistory.create({
            data: {
                userId: admin.id,
                type: "products",
                fileName,
                totalRows: productsInput.length,
                added: prepared.length,
                updated: 0,
                skipped,
                failed: errors.length,
                errors: errors.length > 0 ? errors : Prisma.JsonNull,
                resultData: { durationMs: duration },
            },
        });

        return {
            success: true,
            added: prepared.length,
            updated: 0,
            skipped,
            total: productsInput.length,
            duration,
            errors
        };

    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Import error:", error);

        await prisma.importHistory.create({
            data: {
                userId: "system",
                type: "products",
                fileName,
                totalRows: productsInput.length,
                added: 0,
                updated: 0,
                skipped,
                failed: errors.length,
                errors: [error.message, ...errors],
            },
        });

        return { success: false, error: error.message || "Ошибка импорта", errors };
    } finally {
        client.release();
    }
}