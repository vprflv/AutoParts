// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log(`🛡️ [Middleware] СРАБОТАЛ для: ${path}`);

    const response = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    const cookies = request.cookies.getAll();
                    console.log(`🛡️ [Middleware] Cookies count: ${cookies.length}`);
                    return cookies;
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    console.log(`🛡️ [Middleware] Сессия: ${!!session ? 'ЕСТЬ' : 'НЕТ'}`);
    if (session?.user) {
        console.log(`🛡️ [Middleware] User ID: ${session.user.id}`);
    }

    return response;
}

// Расширенный matcher — ловим почти всё
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};