// // middleware.ts
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
//
// export async function middleware(request: NextRequest) {
//     const pathname = request.nextUrl.pathname
//
//     // === DEV MODE — отключаем защиту ===
//     if (process.env.NODE_ENV === 'development') {
//         console.log(`[Middleware DEV] Пропускаем маршрут: ${pathname}`);
//         return NextResponse.next();
//     }
//
//     // === ПРОДАКШЕН: нормальная проверка ===
//     let response = NextResponse.next({ request })
//
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//         {
//             cookies: {
//                 getAll() { return request.cookies.getAll() },
//                 setAll(cookiesToSet) {
//                     try {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             response.cookies.set(name, value, options)
//                         })
//                     } catch {}
//                 },
//             },
//         }
//     )
//
//     const { data: { session } } = await supabase.auth.getSession()
//
//     const protectedRoutes = ['/profile', '/cart', '/orders', '/favorites']
//
//     const isProtectedRoute = protectedRoutes.some(route =>
//         pathname === route || pathname.startsWith(route + '/')
//     )
//
//     if (isProtectedRoute && !session) {
//         const redirectUrl = new URL('/auth', request.url)
//         redirectUrl.searchParams.set('redirect', pathname + request.nextUrl.search)
//         return NextResponse.redirect(redirectUrl)
//     }
//
//     if (pathname === '/auth' && session) {
//         return NextResponse.redirect(new URL('/profile', request.url))
//     }
//
//     return response
// }
//
// export const config = {
//     matcher: [
//         '/profile/:path*',
//         '/cart/:path*',
//         '/orders/:path*',
//         '/favorites/:path*',
//         '/admin/:path*',
//         '/auth',
//     ],
// }


// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Middleware отключён для разработки
    return NextResponse.next()
}

export const config = {
    matcher: [], // пустой matcher = middleware отключён
}