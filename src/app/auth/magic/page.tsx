// app/auth/magic/page.tsx
import { Suspense } from 'react';
import MagicLinkHandler from './MagicLinkHandler';

export default function MagicLinkPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-white text-xl">Проверяем ссылку...</div>
            </div>
        }>
            <MagicLinkHandler />
        </Suspense>
    );
}