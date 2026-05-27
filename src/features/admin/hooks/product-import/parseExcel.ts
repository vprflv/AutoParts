import * as XLSX from "xlsx";
import { z } from "zod";
import { ImportProduct, ImportResult } from "./types";

const ProductSchema = z.object({
    name: z.string()
        .min(1, "Название обязательно")
        .transform(v => String(v).trim()),

    oem: z.string()
        .min(3, "OEM обязателен (минимум 3 символа)")
        .transform(v => String(v).trim().toUpperCase()),

    brand: z.string()
        .min(1, "Бренд обязателен")
        .transform(v => String(v).trim()),

    price: z.union([z.number(), z.string()])
        .transform(v => Number(v) || 0)
        .refine(v => v >= 0, "Цена не может быть отрицательной"),

    stock: z.union([z.number(), z.string()])
        .transform(v => Number(v) || 0)
        .default(0),

    category: z.string().default("Разное"),
    description: z.string().optional().default(""),
    applicability: z.array(z.string()).default([]),
    crossNumbers: z.string().default(""),
    specifications: z.record(z.string(), z.any()).default({}),
}).passthrough();

function generateSearchText(product: any): string {
    const parts = [
        product.name,
        product.oem,
        product.brand,
        ...(product.crossNumbers
            ? String(product.crossNumbers).split(/[;,|]/).map((s: string) => s.trim())
            : [])
    ].filter(Boolean);

    return parts.join(" | ");
}

function getColumnMap(headers: any[]): Record<string, number> {
    const map: Record<string, number> = {};
    const texts = headers.map(h => String(h || '').toLowerCase().trim());

    const rules: [string, string[]][] = [
        ['oem', ['oem', 'артикул', 'код', 'article']],
        ['name', ['название', 'наименование', 'name']],
        ['brand', ['бренд', 'brand', 'производитель']],
        ['price', ['цена', 'price']],
        ['stock', ['остаток', 'stock', 'количество']],
        ['category', ['категория', 'category']],
        ['description', ['описание', 'description']],
        ['applicability', ['применяемость', 'applicability']],
        ['analogs', ['аналоги', 'cross', 'аналог']],
        ['specifications', ['характеристики', 'specifications', 'specs', 'параметры']],
    ];

    for (const [key, keywords] of rules) {
        for (let i = 0; i < texts.length; i++) {
            if (keywords.some(k => texts[i].includes(k))) {
                map[key] = i;
                break;
            }
        }
    }
    return map;
}

export async function parseExcelFile(
    excelFile: File,
    existingOems: string[] = []
): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                const toAdd: ImportProduct[] = [];
                const toUpdate: ImportProduct[] = [];
                const errors: string[] = [];
                let processed = 0;

                const existingOemSet = new Set(
                    existingOems.map(o => String(o).trim().toUpperCase())
                );

                workbook.SheetNames.forEach(sheetName => {
                    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        defval: "",
                        header: 1,
                        raw: false
                    }) as any[][];

                    if (sheetData.length < 2) return;

                    const headers = sheetData[0];
                    const colMap = getColumnMap(headers);
                    const dataRows = sheetData.slice(1);

                    dataRows.forEach((row, rowIdx) => {
                        const rowNumber = rowIdx + 2;

                        // Пропускаем пустые строки
                        if (!row || row.length === 0 || row.every(c => c == null || String(c).trim() === '')) {
                            return;
                        }

                        processed++;

                        // Извлечение сырых данных
                        const oemRaw = colMap.oem !== undefined
                            ? String(row[colMap.oem] || '')
                            : String(row[0] || '');

                        const nameRaw = colMap.name !== undefined
                            ? String(row[colMap.name] || '')
                            : String(row[1] || '');

                        const brandRaw = colMap.brand !== undefined
                            ? String(row[colMap.brand] || '')
                            : String(row[2] || '');

                        const productBase: any = {
                            name: nameRaw.trim(),
                            oem: oemRaw.trim().toUpperCase(),
                            brand: brandRaw.trim() || "Без бренда",
                            price: Number(colMap.price !== undefined ? row[colMap.price] : row[3]) || 0,
                            stock: Number(colMap.stock !== undefined ? row[colMap.stock] : row[4]) || 0,
                            category: String(colMap.category !== undefined ? row[colMap.category] : row[5] || 'Разное').trim(),
                            description: String(colMap.description !== undefined ? row[colMap.description] : row[6] || '').trim(),
                            applicability: String(colMap.applicability !== undefined ? row[colMap.applicability] : '')
                                .split(/[;,|]/).map(s => s.trim()).filter(Boolean),
                            crossNumbers: String(colMap.analogs !== undefined ? row[colMap.analogs] : row[8] || '')
                                .split(/[;,|]/).map(s => s.trim().toUpperCase())
                                .filter(s => s && s !== oemRaw.trim().toUpperCase())
                                .join(';'),
                            specifications: {}, // можно расширить позже
                        };

                        // === Zod валидация ===
                        try {
                            const validated = ProductSchema.parse(productBase);
                            const searchText = generateSearchText(validated);

                            const finalProduct: ImportProduct = {
                                ...validated,
                                searchText,
                                images: [],
                            };

                            if (existingOemSet.has(validated.oem)) {
                                toUpdate.push(finalProduct);
                            } else {
                                toAdd.push(finalProduct);
                            }
                        } catch (err: any) {
                            if (err instanceof z.ZodError) {
                                const errorMsg = err.issues
                                    .map(issue => {
                                        const field = issue.path.length > 0
                                            ? issue.path.join('.')
                                            : 'общее поле';
                                        return `${field}: ${issue.message}`;
                                    })
                                    .join(', ');

                                errors.push(
                                    `Строка ${rowNumber} | ${productBase.oem || '—'} | ${productBase.name || '—'} → ${errorMsg}`
                                );
                            } else {
                                errors.push(`Строка ${rowNumber} | Неизвестная ошибка валидации`);
                            }
                        }
                    });
                });

                resolve({
                    toAdd,
                    toUpdate,
                    errors,
                    stats: {
                        total: processed,
                        new: toAdd.length,
                        updates: toUpdate.length,
                        errors: errors.length,
                    },
                });
            } catch (err: any) {
                console.error("Критическая ошибка парсинга Excel:", err);
                resolve({
                    toAdd: [],
                    toUpdate: [],
                    errors: ["Критическая ошибка при чтении файла Excel"],
                    stats: { total: 0, new: 0, updates: 0, errors: 1 }
                });
            }
        };

        reader.readAsArrayBuffer(excelFile);
    });
}