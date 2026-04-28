// src/features/admin/hooks/product-import/useProductImport.ts
import { parseExcelFile } from "./parseExcel";
import { saveToDatabase } from "./saveToDatabase";
import { ImportResult } from "./types";

export function useProductImport() {
    const parseImportFile = async (excelFile: File): Promise<ImportResult> => {
        const { data: existing } = await import("@/src/lib/supabase/client").then(({ createClient }) =>
            createClient().from("products").select("oem")
        );

        const existingOems = existing?.map((p: any) => String(p.oem).trim().toUpperCase()) || [];

        return parseExcelFile(excelFile, existingOems);
    };

    const saveToDatabaseFn = async (toAdd: any[], toUpdate: any[]) => {
        return saveToDatabase(toAdd, toUpdate);
    };

    return {
        parseImportFile,
        saveToDatabase: saveToDatabaseFn,
    };
}