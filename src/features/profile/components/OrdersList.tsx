// src/app/profile/components/OrdersList.tsx
export default function OrdersList({ orders = [] }: { orders?: any[] }) {
    if (orders.length === 0) {
        return <div className="text-center py-20 text-zinc-400">У вас пока нет заказов</div>;
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="font-mono text-sm text-zinc-500">{order.id}</p>
                            <p className="text-lg font-medium mt-1">{order.date}</p>
                        </div>
                        <span className={`px-4 py-1.5 text-sm rounded-full font-medium ${
                            order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                order.status === "shipped" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                            {order.status === "delivered" && "Доставлен"}
                            {order.status === "shipped" && "В пути"}
                            {order.status === "pending" && "В обработке"}
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-zinc-400">{order.itemsCount} позиций</p>
                            <p className="text-2xl font-semibold mt-1">{order.total.toLocaleString()} ₽</p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">Подробнее →</button>
                    </div>
                </div>
            ))}
        </div>
    );
}