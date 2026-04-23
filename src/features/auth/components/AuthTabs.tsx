"use client";

interface AuthTabsProps {
    tab: "login" | "register";
    setTab: (tab: "login" | "register") => void;
}

export default function AuthTabs({ tab, setTab }: AuthTabsProps) {
    return (
        <div className="flex border-b border-zinc-800 mb-8">
            <button
                onClick={() => setTab("login")}
                className={`flex-1 py-4 font-medium transition-colors text-base sm:text-lg ${
                    tab === "login"
                        ? "text-white border-b-2 border-blue-600"
                        : "text-zinc-400"
                }`}
            >
                Вход
            </button>
            <button
                onClick={() => setTab("register")}
                className={`flex-1 py-4 font-medium transition-colors text-base sm:text-lg ${
                    tab === "register"
                        ? "text-white border-b-2 border-blue-600"
                        : "text-zinc-400"
                }`}
            >
                Регистрация
            </button>
        </div>
    );
}