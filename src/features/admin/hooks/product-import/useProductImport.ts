// src/features/admin/hooks/product-import/useProductImport.ts
import { parseExcelFile } from "./parseExcel";
import { ImportResult } from "./types";
import { useQuery } from '@tanstack/react-query';

export function useProductImport() {

    const { data: existingOemsData } = useQuery({
        queryKey: ['existingOems'],
        queryFn: async () => {
            const res = await fetch('/api/products/oems');
            if (!res.ok) return [];
            const json = await res.json();
            return json.oems || [];
        },
        staleTime: 1000 * 60 * 10, // 10 минут
    });

    const existingOems = existingOemsData || [];

    const parseImportFile = async (excelFile: File): Promise<ImportResult> => {
        return parseExcelFile(excelFile, existingOems);
    };

    return {
        parseImportFile,
        existingOems,
    };
}