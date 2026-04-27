"use client";


interface AuthTabsProps {
    tab: "login" | "register";
    setTab: (tab: "login" | "register") => void;
}

export default function AuthTabs({ tab, setTab }: AuthTabsProps) {
    return (
        <div className="flex border-b border-zinc-800 mb-6 md:mb-8">
            <button
                onClick={() => setTab("login")}
                className={`flex-1 py-5 md:py-4 font-medium transition-all text-base md:text-lg active:scale-[0.985] ${
                    tab === "login"
                        ? "text-white border-b-2 border-blue-600"
                        : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
                Вход
            </button>

            <button
                onClick={() => setTab("register")}
                className={`flex-1 py-5 md:py-4 font-medium transition-all text-base md:text-lg active:scale-[0.985] ${
                    tab === "register"
                        ? "text-white border-b-2 border-blue-600"
                        : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
                Регистрация
            </button>
        </div>
    );
}