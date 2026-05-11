// src/features/admin/hooks/product-import/useProductImport.ts
import { parseExcelFile } from "./parseExcel";
import { ImportResult } from "./types";

export function useProductImport() {
    const parseImportFile = async (excelFile: File): Promise<ImportResult> => {
        // Парсинг Excel — только на клиенте, без Prisma
        return parseExcelFile(excelFile, []); // existingOems пока пустой, или можно оставить логику
    };

    return {
        parseImportFile,
    };
}