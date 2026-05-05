export const getFreshImageUrl = (url?: string | null): string => {
    if (!url) return "/images/placeholder.svg";


    if (url.includes("supabase.co")) {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}v=${Date.now()}`;
    }
    return url;
};