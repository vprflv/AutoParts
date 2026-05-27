import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { importProducts } from "@/features/admin/actions/productImportActions";

export function useImportProductsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productsInput, fileName }: {
            productsInput: any[];
            fileName?: string
        }) => {
            if (!Array.isArray(productsInput)) {
                throw new Error("productsInput не array!!!");
            }
            return await importProducts(productsInput, fileName);
        },

        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["allProducts"] });
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });

            if (result.success) {
                const added = result.added ?? 0;
                const updated = result.updated ?? 0;
                const skipped = result.skipped ?? 0;
                const totalProcessed = added + updated;

                let message = `✅ Импорт завершён (${totalProcessed} товаров)`;
                if (added > 0) message += ` | Новых: ${added}`;
                if (updated > 0) message += ` | Обновлено: ${updated}`;
                if (skipped > 0) message += ` | Пропущено: ${skipped}`;

                toast.success(message, { duration: 5000 });
            } else {
                toast.error(result.error || "Ошибка импорта", { duration: 7000 });
            }
        },

        onError: (err: any) => {
            console.error("Import error:", err);
            toast.error(err.message || "Критическая ошибка импорта", { duration: 8000 });
        },
    });
}