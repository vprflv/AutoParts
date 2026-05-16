// app/success-order/SuccessOrderContent.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '@/src/store/useCartStore';

export default function SuccessOrderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const clearCart = useCartStore((state) => state.clearCart);

    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            clearCart();
        } else {
            router.push('/');
        }
    }, [orderId, router, clearCart]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="text-7xl mb-8">🎉</div>

                <h1 className="text-4xl font-bold text-white mb-3">Заказ успешно оформлен!</h1>

                {orderId && (
                    <p className="text-cyan-400 text-xl mb-8">
                        № {orderId}
                    </p>
                )}

                <p className="text-zinc-400 mb-10">
                    Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-zinc-200 transition"
                >
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
}