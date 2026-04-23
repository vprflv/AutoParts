// src/features/auth/components/LoginForm.tsx
"use client";



import {useAuthForm} from "@/src/features/auth/hooks/useAuthForm";

interface LoginFormProps {
    onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
    const {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        isLoading,
        handleSubmit,
        validateField,
    } = useAuthForm();

    return (
        <div className="space-y-6">
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField("email")}
                    className={`w-full bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateField("password")}
                    className={`w-full bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-700'} rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 text-base`}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 py-4 rounded-2xl font-medium text-lg transition-all mt-4"
            >
                {isLoading ? "Подождите..." : "Войти"}
            </button>
        </div>
    );
}