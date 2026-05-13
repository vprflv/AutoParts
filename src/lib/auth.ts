import { createServerClientFn } from "@/src/lib/supabase/server";

export async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();

    return user?.id || null;
}



export async function getCurrentProfileUserId(): Promise<string | null> {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) return null;


    const { data: profile } = await supabase
        .from('profiles')
        .select('userid')
        .eq('userid', user.id)
        .single();

    return profile?.userid || user.id;
}

export async function getCurrentUser() {
    const supabase = await createServerClientFn();
    const { data: { user } } = await supabase.auth.getUser();

    return user;
}

