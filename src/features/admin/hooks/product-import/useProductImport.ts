// src/features/admin/hooks/product-import/useProductImport.ts
import { parseExcelFile } from "./parseExcel";
import { saveToDatabase } from "./saveToDatabase";
import { ImportResult } from "./types";

export function useProductImport() {

    // Только парсинг Excel + сохранение товаров (без фото)
    const parseImportFile = async (
        excelFile: File
    ): Promise<ImportResult> => {
        const { data: existing } = await import("@/src/lib/supabase/client").then(({ createClient }) =>
            createClient().from("products").select("oem")
        );

        const existingOems = existing?.map((p: any) => p.oem) || [];
        return parseExcelFile(excelFile, existingOems);
    };

    const saveToDatabaseFn = async (
        toAdd: any[],
        toUpdate: any[]
    ) => {
        return saveToDatabase(toAdd, toUpdate, []); // передаём пустой массив файлов
    };

    return {
        parseImportFile,
        saveToDatabase: saveToDatabaseFn,
    };
}