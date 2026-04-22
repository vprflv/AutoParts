// src/features/admin/hooks/useProductImport.ts
import * as XLSX from "xlsx";

export function useProductImport() {
    const parseImportFile = async (
        excelFile: File,
        imageFiles: File[],
        existingProducts: any[]
    ): Promise<{
        toAdd: any[];
        toUpdate: any[];
        errors: string[];
    }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Карта фото: OEM → массив URL (улучшенная логика)
                    const imageMap = new Map<string, string[]>();
                    imageFiles.forEach((file) => {
                        const fileName = file.name.replace(/\.[^/.]+$/, "").trim();
                        // Ищем все товары, чей OEM является началом имени файла
                        for (const product of existingProducts) {
                            if (fileName.startsWith(product.oem)) {
                                const urls = imageMap.get(product.oem) || [];
                                imageMap.set(product.oem, [...urls, URL.createObjectURL(file)]);
                                break;
                            }
                        }
                    });

                    const toAdd: any[] = [];
                    const toUpdate: any[] = [];
                    const errors: string[] = [];

                    const existingOemSet = new Set(existingProducts.map((p: any) => p.oem));

                    jsonData.forEach((row: any, index: number) => {
                        try {
                            const oem = String(row.OEM || row.oem || "").trim();
                            if (!oem) {
                                errors.push(`Строка ${index + 2}: отсутствует OEM`);
                                return;
                            }

                            const product = {
                                id: `import_${Date.now()}_${index}`,
                                name: String(row.Название || row.name || "").trim(),
                                oem,
                                price: Number(row.Цена || row.price || 0),
                                category: String(row.Категория || row.category || "Разное"),
                                brand: String(row.Бренд || row.brand || "").trim(),
                                stock: Number(row.Остаток || row.stock || 0),
                                images: imageMap.get(oem) || ["https://picsum.photos/id/1015/600/600"],
                                applicability: String(row.Применяемость || "")
                                    .split(",")
                                    .map((s: string) => s.trim())
                                    .filter(Boolean),
                            };

                            if (!product.name || !product.brand || isNaN(product.price)) {
                                errors.push(`Строка ${index + 2}: обязательные поля не заполнены`);
                                return;
                            }

                            if (existingOemSet.has(oem)) {
                                toUpdate.push(product);
                            } else {
                                toAdd.push(product);
                            }
                        } catch (err) {
                            errors.push(`Ошибка обработки строки ${index + 2}`);
                        }
                    });

                    resolve({ toAdd, toUpdate, errors });
                } catch (err) {
                    reject(new Error("Не удалось прочитать Excel файл"));
                }
            };

            reader.onerror = () => reject(new Error("Ошибка чтения файла"));
            reader.readAsArrayBuffer(excelFile);
        });
    };

    return { parseImportFile };
}