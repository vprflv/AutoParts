// src/hooks/useBrands.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";

export const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("products")
                .select("brand")
                .not("brand", "is", null)           // убираем null
                .order("brand", { ascending: true });

            if (error) {
                console.error("Ошибка загрузки брендов:", error);
                throw error;
            }

            // Убираем дубликаты
            const uniqueBrands = Array.from(new Set(data.map(item => item.brand)));

            return uniqueBrands;
        },

    });
};