import { z } from "zod";
import {ImportError} from "@/features/admin/hooks/product-import/types";




export function formatZodError(
    err: any,
    rowNumber: number,
    rawData?: any
): ImportError {
    if (err instanceof z.ZodError) {
        const errors = err.issues.map(issue => {
            const field = issue.path.length > 0 ? issue.path.join('.') : 'общее поле';
            return `${field}: ${issue.message}`;
        });

        return {
            rowNumber,
            oem: rawData?.oem,
            name: rawData?.name,
            errors,
            rawData,
        };
    }

    return {
        rowNumber,
        oem: rawData?.oem,
        name: rawData?.name,
        errors: [err.message || "Неизвестная ошибка"],
        rawData,
    };
}


export function errorsToStrings(errors: ImportError[]): string[] {
    return errors.map(err =>
        `Строка ${err.rowNumber} | ${err.oem || '—'} | ${err.name || '—'} → ${err.errors.join(', ')}`
    );
}


export function stringsToImportErrors(errorStrings: string[] | any): ImportError[] {
    if (!Array.isArray(errorStrings)) return [];

    return errorStrings.map((str, index) => {
        const match = str.match(/Строка (\d+)/);
        const rowNumber = match ? parseInt(match[1]) : index + 1;

        return {
            rowNumber,
            oem: "—",
            name: "—",
            errors: [str],
        };
    });
}

/**
 * Основная функция валидации + форматирования ошибки
 */
export function createImportError(
    rowNumber: number,
    rawData: any,
    error: any
): ImportError {
    return formatZodError(error, rowNumber, rawData);
}