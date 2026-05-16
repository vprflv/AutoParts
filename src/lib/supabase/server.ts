// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerClientFn = async () => {
    const cookieStore = await cookies();

    console.log("[createServerClientFn] Total cookies:", cookieStore.getAll().length);

    const client = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    const allCookies = cookieStore.getAll();
                    console.log("[createServerClientFn] getAll() called → cookies:",
                        allCookies.map(c => c.name));
                    return allCookies;
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

    return client;
};