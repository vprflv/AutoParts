"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({
                                        value,
                                        onChange,
                                        placeholder = "Поиск по названию, OEM, бренду или автомобилю..."
                                    }: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />

                <input
                    type="text"
                    name="search_query"
                    id="main-search-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="search"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl pl-12 pr-12 py-3.5 text-base
                     placeholder:text-zinc-500 focus:outline-none focus:border-blue-600 transition-colors"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}