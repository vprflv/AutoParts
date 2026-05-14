import * as XLSX from "xlsx";
import { z } from "zod";
import { ImportProduct, ImportResult } from "./types";

const ProductSchema = z.object({
    name: z.string().min(1, "Название обязательно").transform(v => String(v).trim()),
    oem: z.string().min(3, "OEM обязателен").transform(v => String(v).trim().toUpperCase()),
    brand: z.string().min(1, "Бренд обязателен").transform(v => String(v).trim()),
    price: z.union([z.number(), z.string()]).transform(v => Number(v) || 0).refine(v => v > 0, "Цена должна быть больше 0"),
    stock: z.union([z.number(), z.string()]).transform(v => Number(v) || 0).default(0),
    category: z.string().default("Разное"),
    description: z.string().optional(),
    applicability: z.array(z.string()).default([]),
    crossNumbers: z.string().default(""),
}).passthrough();

function generateSearchText(product: any): string {
    const parts = [
        product.name,
        product.oem,
        product.brand,
        ...(product.crossNumbers ? String(product.crossNumbers).split(/[;,|]/).map((s: string) => s.trim()) : [])
    ].filter(Boolean);
    return parts.join(" | ");
}

function getColumnMap(headers: any[]): Record<string, number> {
    const map: Record<string, number> = {};
    const texts = headers.map(h => String(h || '').toLowerCase().trim());

    const rules: [string, string[]][] = [
        ['oem', ['oem', 'артикул', 'код']],
        ['name', ['название', 'наименование']],
        ['brand', ['бренд', 'brand', 'производитель']],
        ['price', ['цена', 'price']],
        ['stock', ['остаток', 'stock']],
        ['category', ['категория']],
        ['description', ['описание']],
        ['applicability', ['применяемость']],
        ['analogs', ['аналоги', 'cross']],
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

                const existingOemSet = new Set(existingOems.map(o => String(o).trim().toUpperCase()));

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
                        if (!row || row.length === 0 || row.every(c => !c)) return;
                        processed++;

                        const oemRaw = colMap.oem !== undefined ? String(row[colMap.oem] || '') : String(row[0] || '');
                        const nameRaw = colMap.name !== undefined ? String(row[colMap.name] || '') : String(row[1] || '');
                        const brandRaw = colMap.brand !== undefined ? String(row[colMap.brand] || '') : String(row[2] || '');
                        const priceRaw = colMap.price !== undefined ? String(row[colMap.price] || '') : String(row[3] || '');
                        const stockRaw = colMap.stock !== undefined ? String(row[colMap.stock] || '') : String(row[4] || '');
                        const categoryRaw = colMap.category !== undefined ? String(row[colMap.category] || '') : String(row[5] || 'Разное');
                        const descriptionRaw = colMap.description !== undefined ? String(row[colMap.description] || '') : String(row[6] || '');
                        const applicabilityRaw = colMap.applicability !== undefined ? String(row[colMap.applicability] || '') : String(row[8] || '');
                        const analogsRaw = colMap.analogs !== undefined ? String(row[colMap.analogs] || '') : String(row[9] || '');

                        const oem = oemRaw.trim().toUpperCase();
                        if (!oem || oem.length < 3) return;

                        const productBase = {
                            name: nameRaw.trim(),
                            oem,
                            brand: brandRaw.trim(),
                            price: Number(priceRaw) || 0,
                            stock: Number(stockRaw) || 0,
                            category: categoryRaw.trim(),
                            description: descriptionRaw.trim() || undefined,
                            applicability: applicabilityRaw.split(/[;,|]/).map(s => s.trim()).filter(Boolean),
                            crossNumbers: analogsRaw.split(/[;,|]/)
                                .map(s => s.trim().toUpperCase())
                                .filter(s => s && s !== oem)
                                .join(';'),
                            images: [],
                            specifications: {},
                        };

                        try {
                            ProductSchema.parse(productBase);

                            const searchText = generateSearchText(productBase);

                            const finalProduct: ImportProduct = { ...productBase, searchText };

                            if (existingOemSet.has(oem)) {
                                toUpdate.push(finalProduct);
                            } else {
                                toAdd.push(finalProduct);
                            }
                        } catch (err: any) {
                            const msg = err.errors?.map((e: any) => e.message).join(", ") || err.message;
                            errors.push(`Строка ${rowIdx + 2} (OEM: ${oem}) → ${msg}`);
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
            } catch (err) {
                console.error(err);
                resolve({
                    toAdd: [], toUpdate: [],
                    errors: ["Ошибка чтения файла"],
                    stats: { total: 0, new: 0, updates: 0, errors: 1 }
                });
            }
        };

        reader.readAsArrayBuffer(excelFile);
    });
}