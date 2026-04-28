import { type NextRequest } from 'next/server'
import {updateSession} from "@/src/lib/supabase/middleware";


export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/cart/:path*',
        '/admin/:path*',
        '/orders/:path*',
        '/checkout/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}