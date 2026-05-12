            export const getFreshImageUrl = (url: string | null | undefined): string => {
                if (!url || typeof url !== "string" || url.trim() === "") {
            return "/images/placeholder.svg";
                    }

            if (url.includes("supabase.co/storage")) {
                const separator = url.includes("?") ? "&" : "?";
                return `${url}${separator}v=${Date.now()}`;
            }

            return url;
};