// src/hooks/useAdminProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/src/lib/supabase/client";
import { Product } from "@/src/types";

const supabase = createClient();

export function useAdminProducts() {
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: async (): Promise<Product[]> => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data || [];
        },
        staleTime: 1000 * 60 * 2,
    });

    // Добавление / обновление товаров
    const addOrUpdateProducts = useMutation({
        mutationFn: async (newProducts: Product[]) => {
            const { error } = await supabase
                .from("products")
                .upsert(newProducts);   // ← убрали onConflict

            if (error) throw error;
            return newProducts;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // Удаление товара
    const deleteProduct = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        products,
        isLoading,
        addOrUpdateProducts: addOrUpdateProducts.mutate,
        deleteProduct: deleteProduct.mutate,
        isAddingOrUpdating: addOrUpdateProducts.isPending,
        isDeleting: deleteProduct.isPending,
    };
}