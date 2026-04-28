// src/features/admin/hooks/product-import/saveToDatabase.ts
import { createClient } from "@/src/lib/supabase/client";
import { ImportProduct } from "./types";

const supabase = createClient();

export async function saveToDatabase(
    toAdd: ImportProduct[],
    toUpdate: ImportProduct[]
) {
    const results = { added: 0, updated: 0, failed: 0 };

    try {
        if (toAdd.length > 0) {
            const { error } = await supabase
                .from("products")
                .insert(toAdd);

            if (error) throw error;
            results.added = toAdd.length;
        }

        if (toUpdate.length > 0) {
            const { error } = await supabase
                .from("products")
                .upsert(toUpdate, {
                    onConflict: "oem" as const,
                    ignoreDuplicates: false
                });

            if (error) throw error;
            results.updated = toUpdate.length;
        }
    } catch (err: any) {
        console.error("💥 Ошибка сохранения:", err);
        throw new Error(err.message || "Не удалось сохранить товары");
    }

    return results;
}