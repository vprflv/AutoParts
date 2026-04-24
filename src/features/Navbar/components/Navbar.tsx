// src/features/Navbar/components/Navbar.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";

import CartDrawer from "./cart/CartModal";
import AuthModal from "../../auth/components/AuthModal";
import SearchInput from "./SearchInput";

interface NavbarProps {
    onSearchChange: (search: string) => void;
    searchValue: string;
}

export default function Navbar({ onSearchChange, searchValue }: NavbarProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const totalItems = useCartStore((state) => state.totalItems());

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">

                        {/* Логотип */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">

                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">AutoPart</h1>
                                <p className="text-[10px] text-zinc-500 -mt-1">Pro</p>
                            </div>
                        </div>

                        {/* Поиск — скрываем на очень маленьких экранах и показываем в центре на больших */}
                        <div className="hidden md:block flex-1 max-w-xl mx-8">
                            <SearchInput
                                value={searchValue}
                                onChange={onSearchChange}
                            />
                        </div>

                        {/* Иконки справа */}
                        <div className="flex items-center gap-2">
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

                            <button
                                onClick={() => setIsAuthOpen(true)}
                                className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors"
                            >
                                <User className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Поиск под навбаром — только на мобильных */}
                    <div className="md:hidden mt-4">
                        <SearchInput
                            value={searchValue}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}