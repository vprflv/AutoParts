import { useQuery } from "@tanstack/react-query";
import {getBrands} from "@/features/actions/productActions";


export const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
        staleTime: 10 * 60 * 1000,   // 10 минут (бренды меняются редко)
        gcTime: 30 * 60 * 1000,
        retry: 2,
    });
};