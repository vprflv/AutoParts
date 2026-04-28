// app/admin/photos/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { Trash2, Search, X } from "lucide-react";
import { toast } from "react-hot-toast";

const supabase = createClient();

export default function AdminPhotosPage() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const loadPhotos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .storage
                .from("product-images")
                .list("", {
                    limit: 1000,
                    sortBy: { column: "name", order: "asc" }
                });

            if (error) throw error;
            setPhotos(data || []);
        } catch (err) {
            toast.error("Не удалось загрузить список фото");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Надёжное удаление: Storage + очистка из всех товаров
    const deletePhoto = async (fileName: string) => {
        if (!confirm(`Удалить фото "${fileName}"?`)) return;

        try {
            const publicUrl = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName).data.publicUrl;

            // 1. Удаляем файл из Storage
            const { error: storageError } = await supabase
                .storage
                .from("product-images")
                .remove([fileName]);

            if (storageError) throw storageError;

            // 2. Находим все товары, где есть это фото
            const { data: productsWithPhoto } = await supabase
                .from("products")
                .select("id, images")
                .contains("images", [publicUrl]);

            // 3. Очищаем это фото из всех товаров
            if (productsWithPhoto && productsWithPhoto.length > 0) {
                for (const prod of productsWithPhoto) {
                    const newImages = (prod.images || []).filter(
                        (url: string) => url !== publicUrl
                    );

                    await supabase
                        .from("products")
                        .update({ images: newImages })
                        .eq("id", prod.id);
                }
            }

            toast.success(`Фото "${fileName}" успешно удалено`);
            loadPhotos(); // обновляем список

        } catch (err: any) {
            console.error(err);
            toast.error("Ошибка при удалении фото");
        }
    };

    const filteredPhotos = useMemo(() => {
        if (!searchQuery.trim()) return photos;
        const q = searchQuery.toLowerCase().trim();
        return photos.filter(photo => photo.name.toLowerCase().includes(q));
    }, [photos, searchQuery]);

    useEffect(() => {
        loadPhotos();
    }, []);

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold">Управление фото</h1>

                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Поиск по названию файла..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 pl-10 py-3 rounded-2xl focus:outline-none focus:border-blue-600"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={loadPhotos}
                        className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
                    >
                        Обновить
                    </button>
                </div>
            </div>

            <p className="text-zinc-400 mb-6">
                Найдено: <span className="text-white font-medium">{filteredPhotos.length}</span> фото
            </p>

            {loading ? (
                <div className="text-center py-20 text-zinc-400">Загрузка фото...</div>
            ) : filteredPhotos.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    {searchQuery ? "Ничего не найдено" : "В хранилище пока нет фото"}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredPhotos.map((photo) => {
                        const publicUrl = supabase.storage
                            .from("product-images")
                            .getPublicUrl(photo.name).data.publicUrl;

                        return (
                            <div key={photo.name} className="bg-zinc-900 rounded-2xl overflow-hidden group border border-zinc-800 hover:border-zinc-700 transition">
                                <div className="aspect-square bg-zinc-950 relative">
                                    <img
                                        src={publicUrl}
                                        alt={photo.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => deletePhoto(photo.name)}
                                        className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="p-3 text-xs text-zinc-400 break-all font-mono">
                                    {photo.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}