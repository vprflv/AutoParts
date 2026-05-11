// app/success-order/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Опционально: очищаем корзину после успешного заказа
        // localStorage.removeItem('cart');
        // или через Zustand: useCartStore.getState().clearCart();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                    Заказ успешно оформлен!
                </h1>

                <p className="text-zinc-400 text-lg mb-8">
                    Благодарим за заказ. Наши сотрудники свяжутся с вами в ближайшее время для уточнения деталей.
                </p>

                {orderId && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
                        <p className="text-sm text-zinc-500">Номер вашего заказа</p>
                        <p className="text-xl font-mono text-cyan-400">#{orderId}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/')}
                        className="btn-neon w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium py-3.5 rounded-xl transition"
                    >
                        Продолжить покупки
                    </button>

                    <button
                        onClick={() => router.push('/profile?tab=orders')}
                        className="w-full border border-zinc-700 hover:bg-zinc-900 text-white py-3.5 rounded-xl transition"
                    >
                        Мои заказы
                    </button>
                </div>
            </div>
        </div>
    );
}