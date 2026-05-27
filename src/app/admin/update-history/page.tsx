// app/admin/update-history/page.tsx
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import HistoryDetailModal from "@/features/admin/components/HistoryDetailModal";


async function getImportHistory() {
    return await prisma.importHistory.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        take: 50,
    });
}

export default async function UpdateHistoryPage() {
    const history = await getImportHistory();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">История обновлений товаров</h1>
                <p className="text-zinc-500">Последние 50 импортов</p>
            </div>

            <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                <table className="w-full">
                    <thead className="bg-zinc-800 border-b border-zinc-700">
                    <tr>
                        <th className="p-4 text-left">Дата и время</th>
                        <th className="p-4 text-left">Файл</th>
                        <th className="p-4 text-center">Всего строк</th>
                        <th className="p-4 text-center text-green-400">Добавлено</th>
                        <th className="p-4 text-center text-yellow-400">Пропущено</th>
                        <th className="p-4 text-center text-red-400">Ошибок</th>
                        <th className="p-4 text-left">Кем</th>
                        <th className="p-4 text-center">Статус</th>
                        <th className="p-4 text-center w-20">Подробнее</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-800/50">
                            <td className="p-4 whitespace-nowrap">
                                {format(new Date(item.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}
                            </td>
                            <td className="p-4 font-medium">{item.fileName || "—"}</td>
                            <td className="p-4 text-center">{item.totalRows}</td>
                            <td className="p-4 text-center font-semibold text-green-400">{item.added}</td>
                            <td className="p-4 text-center text-yellow-400">{item.skipped}</td>
                            <td className="p-4 text-center text-red-400 font-medium">{item.failed}</td>
                            <td className="p-4 text-sm text-zinc-400">
                                {item.user?.name || item.user?.email || "system"}
                            </td>
                            <td className="p-4 text-center">
                                {item.failed === 0 && item.errors === null ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                )}
                            </td>
                            <td className="p-4 text-center">
                                <HistoryDetailModal historyItem={item} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {history.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">
                        История обновлений пока пуста
                    </div>
                )}
            </div>
        </div>
    );
}