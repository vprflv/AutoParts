// src/features/admin/hooks/useAdminProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {deleteProductAction, getAdminProducts} from "@/features/admin/actions/adminProductActions";

// Server Action (создадим ниже)


export function useAdminProducts() {
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: getAdminProducts,           // ← Server Action
        staleTime: 1000 * 60 * 2,
    });

    const deleteProduct = useMutation({
        mutationFn: deleteProductAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        products,
        isLoading,
        deleteProduct: deleteProduct.mutate,
        isDeleting: deleteProduct.isPending,
    };
}