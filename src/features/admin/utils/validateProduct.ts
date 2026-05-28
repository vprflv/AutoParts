import { z } from "zod";
import {ImportProduct} from "@/features/admin/hooks/product-import";
import {ProductSchema} from "@/features/admin/hooks/product-import/parcer/schemas/productSchema";
import {generateSearchText} from "@/features/admin/utils/generateSearchText";


export type ValidationResult =
    | { success: true; product: ImportProduct; rowNumber?: number }
    | { success: false; rowNumber?: number; oem?: string; name?: string; errors: string[] };

export function validateProduct(
    rawData: any,
    rowNumber?: number
): ValidationResult {
    try {
        const validated = ProductSchema.parse(rawData);

        const finalProduct: ImportProduct = {
            ...validated,
            searchText: generateSearchText(validated),
            images: validated.images || [],
        };

        return { success: true, product: finalProduct, rowNumber };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const errors = err.issues.map(issue => {
                const field = issue.path.length > 0 ? issue.path.join('.') : 'общее поле';
                return `${field}: ${issue.message}`;
            });

            return {
                success: false,
                rowNumber,
                oem: rawData?.oem,
                name: rawData?.name,
                errors,
            };
        }

        return {
            success: false,
            rowNumber,
            oem: rawData?.oem,
            name: rawData?.name,
            errors: [err.message || "Неизвестная ошибка"],
        };
    }
}