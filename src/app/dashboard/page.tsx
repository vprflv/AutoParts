// app/dashboard/page.tsx
'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        logout();
        toast.success('Вы вышли из аккаунта');
        router.push('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <p>Нет данных пользователя. Перенаправляем...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">

                    <div className="flex items-center gap-4">

                    </div>
                </div>

                    <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 flex flex-col">
                        <h2 className="text-2xl font-semibold mb-6">Вы авторизованы</h2>

                        <div className="space-y-3 flex-1">
                            <Link
                                href="/"
                                className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 transition py-4 rounded-xl font-medium"
                            >
                                 На главную страницу
                            </Link>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-8 w-full py-4 text-red-400 hover:bg-red-950/30 transition rounded-xl border border-red-900/50"
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
        </div>
    );
}