import * as XLSX from "xlsx";
import {ImportProduct, ImportResult} from "@/features/admin/hooks/product-import";
import {getColumnMap} from "@/features/admin/hooks/product-import/parcer/components/columnMapping";
import {validateProduct} from "@/features/admin/utils/validateProduct";


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
                            specifications: {},
                        };

                        // === Валидация ===
                        const validation = validateProduct(productBase, rowNumber);

                        if (!validation.success) {
                            // Предполагаем, что validateProduct возвращает { success: false, error: ImportError }
                            const err = validation.error;
                            errors.push(
                                `Строка ${err.rowNumber} | ${err.oem || '—'} | ${err.name || '—'} → ${err.errors.join(', ')}`
                            );
                            return;
                        }

                        // Успешная валидация
                        if (existingOemSet.has(validation.product.oem)) {
                            toUpdate.push(validation.product);
                        } else {
                            toAdd.push(validation.product);
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