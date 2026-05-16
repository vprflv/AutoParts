"use client";

import { useState } from "react";
import { ShoppingCart, User, LogOut, UserCircle } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import CartModal from "./cart/CartModal";
import AuthModal from "../../auth/components/AuthModal";
import SearchInput from "@/src/features/Navbar/components/SearchInput";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
interface NavbarProps {
    onSearchChange: (search: string) => void;
    searchValue: string;
}

export default function Navbar({ onSearchChange, searchValue }: NavbarProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const { user, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.totalItems());
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        toast.success("Вы успешно вышли из аккаунта");
    };

    // Адаптация под новую структуру User
    const avatarUrl = user?.avatarUrl ||
        (user?.telegramId
            ? `https://t.me/i/userpic/320/${user.username || user.id}.jpg`
            : null);

    const displayName = user?.name || user?.username || "Пользователь";

    const isTelegramUser = !!user?.telegramId;
    const userSubtitle = isTelegramUser
        ? `@${user?.username || 'telegram'}`
        : user?.email?.split('@')[0] || '';

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">

                        {/* Логотип */}
                        <Link href="/">
                            <div className="flex items-center gap-3 flex-shrink-0 group">
                                {/* НОВЫЙ ЛОГОТИП */}
                                <div className="relative w-10 h-10 flex-shrink-0 transition-all">
                                    <Image
                                        src="/images/logo.png"
                                        alt="AutoPart PRO"
                                        fill
                                        className="object-contain drop-shadow-[0_0_5px_rgb(34,211,238)]"
                                        priority
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tighter bg-cyan-600 bg-clip-text text-transparent">
                                        AutoForge
                                    </h1>
                                    <p className="text-[10px] text-zinc-500 -mt-1 tracking-widest">PRO</p>
                                </div>
                            </div>
                        </Link>

                        {/* Поиск */}
                        <div className="hidden md:block flex-1 max-w-xl mx-8">
                            <SearchInput value={searchValue} onChange={onSearchChange} />
                        </div>

                        {/* Правая часть */}
                        <div className="flex items-center gap-3">
                            {/* Корзина */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-3.5 hover:bg-zinc-900 rounded-2xl transition-all active:scale-95 group"
                            >
                                <ShoppingCart className="w-6 h-6 text-zinc-300 group-hover:text-cyan-300 transition-colors" />

                                {totalItems > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-cyan-200 to-blue-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-neon-main ring-2 ring-cyan-400/50">
                                        {totalItems}
                                    </div>
                                )}
                            </button>

                            {/* Профиль */}
                            {user ? (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center gap-3 p-2 pr-4 hover:bg-zinc-900 rounded-2xl transition-all hover:scale-105 focus:outline-none">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={displayName}
                                                className="w-9 h-9 rounded-2xl object-cover border-2 border-cyan-500/30"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg border-2 border-cyan-500/30">
                                                {displayName?.[0] || "U"}
                                            </div>
                                        )}

                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-semibold text-white">
                                                {displayName}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {userSubtitle}
                                            </p>
                                        </div>
                                    </Menu.Button>

                                    <Transition
                                        enter="transition duration-200 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-150 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl py-2 z-50 focus:outline-none overflow-hidden">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => router.push("/profile")}
                                                        className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm ${active ? "bg-zinc-800 text-cyan-400" : "text-zinc-300"}`}
                                                    >
                                                        <UserCircle className="w-5 h-5" />
                                                        Личный кабинет
                                                    </button>
                                                )}
                                            </Menu.Item>

                                            <div className="border-t border-zinc-800 my-1" />

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-400 ${active ? "bg-zinc-800" : ""}`}
                                                    >
                                                        <LogOut className="w-5 h-5" />
                                                        Выйти
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="p-3 hover:bg-zinc-900 rounded-2xl transition-all hover:scale-110"
                                >
                                    <User className="w-6 h-6 text-zinc-300 hover:text-cyan-300" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Мобильный поиск */}
                    <div className="md:hidden mt-4">
                        <SearchInput value={searchValue} onChange={onSearchChange} />
                    </div>
                </div>
            </nav>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}