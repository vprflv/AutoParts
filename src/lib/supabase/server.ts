// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerClientFn = async () => {
    const cookieStore = await cookies();

    console.log("[createServerClientFn] Cookies count:", cookieStore.getAll().length);
    // console.log("[createServerClientFn] Cookies:", cookieStore.getAll().map(c => c.name)); // раскомментируй при необходимости

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (err) {
                        console.error("[createServerClientFn] setAll error:", err);
                    }
                },
            },
        }
    );
};