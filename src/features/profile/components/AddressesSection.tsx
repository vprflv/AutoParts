import { MapPin } from "lucide-react";

export default function AddressesSection({ addresses = [] }: { addresses?: any[] }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Адреса доставки ({addresses.length})</h3>
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-2xl text-sm font-medium transition">
                    + Новый адрес
                </button>
            </div>

            <div className="space-y-4">
                {addresses.map((addr: any) => (
                    <div key={addr.id} className="bg-zinc-800/50 rounded-2xl p-6 flex gap-6 group">
                        <MapPin className="w-6 h-6 text-zinc-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <p className="font-medium">{addr.name}</p>
                                {addr.isDefault && (
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full">Основной</span>
                                )}
                            </div>
                            <p className="text-zinc-300 mt-2">{addr.street}</p>
                            <p className="text-zinc-400">{addr.city}, {addr.postalCode}</p>
                            <p className="text-zinc-400 mt-1">{addr.phone}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 text-sm">
                            <button className="text-blue-400 hover:text-blue-500">Изменить</button>
                            {!addr.isDefault && <button className="text-red-400 hover:text-red-500">Удалить</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}