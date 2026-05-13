// app/success-order/page.tsx
import { Suspense } from 'react';
import SuccessOrderContent from "@/features/success-order/SuccessOrderContent";


export default function SuccessOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div>Загрузка...</div>
            </div>
        }>
            <SuccessOrderContent />
        </Suspense>
    );
}