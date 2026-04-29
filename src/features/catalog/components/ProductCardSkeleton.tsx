export default function ProductCardSkeleton() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full animate-pulse">
            {/* Изображение */}
            <div className="relative aspect-[4/3] bg-zinc-800" />

            {/* Контент */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex-1 space-y-3">
                    {/* Бренд и категория */}
                    <div className="h-3.5 bg-zinc-800 rounded w-2/3" />

                    {/* Название */}
                    <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded w-full" />
                        <div className="h-4 bg-zinc-800 rounded w-4/5" />
                    </div>

                    {/* OEM */}
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>

                <div className="mt-auto pt-6 space-y-4">
                    {/* Цена */}
                    <div className="h-8 bg-zinc-800 rounded w-3/5" />

                    {/* В наличии */}
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />

                    {/* Кнопка */}
                    <div className="h-12 bg-zinc-800 rounded-2xl w-full" />
                </div>
            </div>
        </div>
    );
}