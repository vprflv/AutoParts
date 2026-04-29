// src/features/Navbar/components/Navbar.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, User, LogOut, UserCircle, Package } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import CartModal from "./cart/CartModal";
import AuthModal from "../../auth/components/AuthModal";
import SearchInput from "@/src/features/Navbar/components/SearchInput";
import {toast} from "react-hot-toast";
import Link from "next/link";

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

    const handleLogout = () => {
        logout();
        toast.success("Вы вышли из аккаунта");
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">

                        {/* Логотип */}

                        <Link href='/'>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">

                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">AutoPart</h1>

                                <p className="text-[10px] text-zinc-500 -mt-1">Pro</p>
                            </div>
                        </div>
                        </Link>

                        {/* Поиск */}
                        <div className="hidden md:block flex-1 max-w-xl mx-8">
                            <SearchInput value={searchValue} onChange={onSearchChange} />
                        </div>

                        {/* Правая часть */}
                        <div className="flex items-center gap-2">
                            {/* Корзина */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {totalItems > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </div>
                                )}
                            </button>

                            {/* Профиль с выпадающим меню */}
                            {user ? (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center gap-3 p-2 pr-3 hover:bg-zinc-900 rounded-2xl transition-colors focus:outline-none">

                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name?.[0] || "А"}
                                            </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-medium text-white leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                        </div>
                                    </Menu.Button>

                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl py-2 z-50 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => router.push("/profile")}
                                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${active ? "bg-zinc-800" : ""}`}
                                                    >
                                                        <UserCircle className="w-5 h-5" />
                                                        Личный кабинет
                                                    </button>
                                                )}
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => router.push("/profile?tab=orders")}
                                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${active ? "bg-zinc-800" : ""}`}
                                                    >
                                                        <Package className="w-5 h-5" />
                                                        Мои заказы
                                                    </button>
                                                )}
                                            </Menu.Item>

                                            <div className="border-t border-zinc-700 my-1" />

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 ${active ? "bg-zinc-800" : ""}`}
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
                                /* Неавторизованный пользователь */
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors"
                                >
                                    <User className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Поиск на мобильных */}
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