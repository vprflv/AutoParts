import { useQuery } from "@tanstack/react-query";
import { getAllLightProducts } from "@/features/actions/productActions";
import { Product } from "@/types";

export const useAllProducts = () => {
    return useQuery<Product[]>({
        queryKey: ["allProducts"],
        queryFn: getAllLightProducts,
        staleTime: 30 * 60 * 1000,          
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};