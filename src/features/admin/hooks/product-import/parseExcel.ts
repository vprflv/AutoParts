// src/features/admin/hooks/product-import/parseExcel.ts
import * as XLSX from "xlsx";
import { z } from "zod";
import { ImportProduct, ImportResult } from "./types";

const ProductSchema = z.object({
    name: z.string().min(2, "Название слишком короткое"),
    oem: z.string().min(3, "OEM обязателен"),
    brand: z.string().min(1, "Бренд обязателен"),
    price: z.number().positive("Цена должна быть больше 0"),
    stock: z.number().int().nonnegative(),
    category: z.string().default("Разное"),
    applicability: z.array(z.string()).default([]),
    crossNumbers: z.array(z.string()).default([]),
    description: z.string().optional(),
});

export async function parseExcelFile(
    excelFile: File,
    existingOems: string[] = []
): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });

                const toAdd: ImportProduct[] = [];
                const toUpdate: ImportProduct[] = [];
                const errors: string[] = [];

                // Нормализуем существующие OEM для надёжного сравнения
                const existingOemSet = new Set(
                    existingOems.map(o => String(o).trim().toUpperCase())
                );

                jsonData.forEach((row: any, index: number) => {
                    try {
                        let oem = String(row.OEM || row.oem || row["ОЕМ"] || row["Код"] || "")
                            .trim()
                            .toUpperCase();

                        if (!oem) {
                            errors.push(`Строка ${index + 2}: отсутствует OEM`);
                            return;
                        }

                        const product: ImportProduct = {
                            name: String(row.Название || row.name || row["Наименование"] || "").trim(),
                            oem,
                            brand: String(row.Бренд || row.brand || "").trim(),
                            price: Number(row.Цена || row.price || row["Цена"] || 0),
                            stock: Number(row.Остаток || row.stock || row["Количество"] || 0),
                            category: String(row.Категория || row.category || "Разное").trim(),
                            applicability: String(row.Применяемость || row.applicability || "")
                                .split(/[;,|]/)
                                .map(s => s.trim())
                                .filter(Boolean),
                            crossNumbers: String(row.Кросс || row.cross || row["Аналоги"] || "")
                                .split(/[;,|]/)
                                .map(s => s.trim().toUpperCase())
                                .filter(s => s && s !== oem),
                            images: [],
                            description: row.Описание || row.description || undefined,
                        };

                        ProductSchema.parse(product);

                        // Самое важное сравнение
                        if (existingOemSet.has(oem)) {
                            toUpdate.push(product);
                        } else {
                            toAdd.push(product);
                        }
                    } catch (err: any) {
                        errors.push(`Строка ${index + 2} (OEM: ${row.OEM || "—"}): ${err.message}`);
                    }
                });

                resolve({
                    toAdd,
                    toUpdate,
                    errors,
                    stats: {
                        total: jsonData.length,
                        new: toAdd.length,
                        updates: toUpdate.length,
                        errors: errors.length,
                    },
                });
            } catch (err) {
                reject(new Error("Не удалось прочитать Excel файл"));
            }
        };

        reader.onerror = () => reject(new Error("Ошибка чтения файла"));
        reader.readAsArrayBuffer(excelFile);
    });
}