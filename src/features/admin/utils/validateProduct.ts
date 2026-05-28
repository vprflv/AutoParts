import { ImportProduct } from "@/features/admin/hooks/product-import";
import { ImportError } from "@/features/admin/hooks/product-import/types";
import { ProductSchema } from "@/features/admin/hooks/product-import/parcer/schemas/productSchema";
import { generateSearchText } from "@/features/admin/utils/generateSearchText";
import { formatZodError } from "@/features/admin/hooks/product-import/importErrors";

export type ValidationResult =
    | { success: true; product: ImportProduct; rowNumber?: number }
    | { success: false; error: ImportError };

export function validateProduct(rawData: any, rowNumber?: number): ValidationResult {
    try {
        const validated = ProductSchema.parse(rawData);

        const finalProduct: ImportProduct = {
            ...validated,
            searchText: generateSearchText(validated),
            images: [],
        };

        return {
            success: true,
            product: finalProduct,
            rowNumber,
        };
    } catch (err: any) {
        const importError = formatZodError(err, rowNumber || 0, rawData);

        return {
            success: false,
            error: importError,
        };
    }
}