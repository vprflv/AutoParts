
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { products as mockProducts } from "@/src/lib/mockData";
import {Product} from "@/src/types";

export function useAdminProducts() {
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: async (): Promise<Product[]> => {
            await new Promise((r) => setTimeout(r, 150));
            return [...mockProducts];
        },
        staleTime: 1000 * 60 * 5,
    });

    // Добавление / обновление товаров по OEM
    const addOrUpdateProducts = (newProducts: Product[]) => {
        queryClient.setQueryData(["adminProducts"], (old: Product[] | undefined) => {
            const existingMap = new Map((old || []).map(p => [p.oem, p]));

            newProducts.forEach(newProduct => {
                existingMap.set(newProduct.oem, {
                    ...existingMap.get(newProduct.oem), // сохраняем старые данные, если есть
                    ...newProduct,                      // перезаписываем новыми
                });
            });

            return Array.from(existingMap.values());
        });

        // Также обновляем основной кэш каталога
        queryClient.setQueryData(["products"], (old: Product[] | undefined) => {
            const existingMap = new Map((old || []).map(p => [p.oem, p]));

            newProducts.forEach(newProduct => {
                existingMap.set(newProduct.oem, {
                    ...existingMap.get(newProduct.oem),
                    ...newProduct,
                });
            });

            return Array.from(existingMap.values());
        });
    };

    // Удаление товара
    const deleteProduct = (id: string) => {
        queryClient.setQueryData(["adminProducts"], (old: Product[] | undefined) =>
            old ? old.filter(p => p.id !== id) : []
        );

        queryClient.setQueryData(["products"], (old: Product[] | undefined) =>
            old ? old.filter(p => p.id !== id) : []
        );
    };

    return {
        products,
        isLoading,
        deleteProduct,
        addOrUpdateProducts,
    };
}