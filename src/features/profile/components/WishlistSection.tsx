import { Heart } from "lucide-react";

export default function WishlistSection({ wishlist = [] }: { wishlist?: string[] }) {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6">
                Избранное {wishlist.length > 0 && `(${wishlist.length})`}
            </h3>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                    <Heart size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg">В избранном пока ничего нет</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Здесь будут карточки товаров */}
                    <div className="bg-zinc-800 rounded-2xl p-8 text-center text-zinc-400 border border-dashed border-zinc-700">
                        Здесь будут карточки избранных товаров
                    </div>
                </div>
            )}
        </div>
    );
}