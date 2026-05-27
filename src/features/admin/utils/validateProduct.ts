// src/features/admin/utils/validateProduct.ts
export interface ValidationError {
    row?: number;
    oem?: string;
    field: string;
    message: string;
}

export function validateProduct(p: any, rowIndex?: number): ValidationError[] {
    const errors: ValidationError[] = [];

    console.log(`🔍 Валидация строки ${rowIndex}:`, JSON.stringify(p, null, 2).slice(0, 500)); // ← диагностика

    if (!p) {
        errors.push({ row: rowIndex, field: "data", message: "Товар отсутствует (null/undefined)" });
        return errors;
    }

    const oem = String(p.oem || '').trim().toUpperCase();
    const name = String(p.name || '').trim();
    const brand = String(p.brand || '').trim();

    // Основные проверки
    if (!oem || oem.length < 3) {
        errors.push({
            row: rowIndex,
            field: "oem",
            message: `OEM обязателен и должен содержать минимум 3 символа (получено: "${oem}")`
        });
    }

    if (!name) {
        errors.push({
            row: rowIndex,
            oem: oem || undefined,
            field: "name",
            message: "Название товара обязательно"
        });
    }

    if (!brand) {
        errors.push({
            row: rowIndex,
            oem: oem || undefined,
            field: "brand",
            message: "Бренд обязателен"
        });
    }

    // Проверка цены (опционально, но рекомендуем)
    const price = p.price != null ? Number(p.price) : NaN;
    if (isNaN(price) || price < 0) {
        errors.push({
            row: rowIndex,
            oem: oem || undefined,
            field: "price",
            message: `Некорректная цена: ${p.price} (должна быть числом ≥ 0)`
        });
    }

    return errors;
}

export function formatError(e: ValidationError): string {
    const rowInfo = e.row !== undefined ? `Строка ${e.row + 1}` : '';
    const oemInfo = e.oem ? `[${e.oem}]` : '';
    return `${rowInfo} ${oemInfo} ${e.message}`.trim();
}