// src/features/auth/hooks/useAuthForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuthStore } from "@/src/store/useAuthStore";

const loginSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string().min(1, "Введите пароль"),
});

const registerSchema = z.object({
    name: z.string().min(1, "Имя обязательно").max(50, "Имя слишком длинное").trim(),
    email: z.string().email("Введите корректный email"),
    password: z.string()
        .min(8, "Пароль должен содержать минимум 8 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export function useAuthForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const { login, register, clearError, error: storeError } = useAuthStore();

    // Красивая обработка ошибок из Supabase
    useEffect(() => {
        if (storeError) {
            let message = storeError;

            if (storeError.includes("Invalid login credentials") ||
                storeError.includes("invalid credentials")) {
                message = "Неправильный логин или пароль";
            } else if (storeError.includes("Email not confirmed")) {
                message = "Email не подтверждён";
            } else if (storeError.includes("too many requests") || storeError.includes("429")) {
                message = "Слишком много попыток. Подождите немного";
            }

            setErrors(prev => ({ ...prev, email: message }));
        }
    }, [storeError]);

    const validateField = (field: "name" | "email" | "password") => {
        try {
            if (field === "name") {
                registerSchema.shape.name.parse(name);
            } else if (field === "email") {
                z.string().email("Введите корректный email").parse(email);
            } else if (field === "password") {
                (name ? registerSchema : loginSchema).shape.password.parse(password);
            }
            setErrors(prev => ({ ...prev, [field]: "" }));
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                [field]: err?.issues?.[0]?.message || "Неверное значение"
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors = { name: "", email: "", password: "" };

        try {
            if (name?.trim()) {
                registerSchema.parse({ name: name.trim(), email, password });
            } else {
                loginSchema.parse({ email, password });
            }
        } catch (err: any) {
            if (err?.issues) {
                err.issues.forEach((issue: any) => {
                    const field = issue.path[0] as keyof typeof newErrors;
                    if (field) newErrors[field] = issue.message;
                });
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(e => e === "");
    };

    const handleSubmit = async (): Promise<boolean> => {
        setIsLoading(true);
        setErrors({ name: "", email: "", password: "" });
        clearError();

        if (!validateForm()) {
            setIsLoading(false);
            return false;
        }

        let success = false;

        try {
            if (name?.trim()) {
                success = await register(name.trim(), email, password);
            } else {
                success = await login(email, password);
            }

            return success;
        } catch (err: any) {
            console.error("Auth error:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name, setName,
        email, setEmail,
        password, setPassword,
        agreePolicy, setAgreePolicy,
        errors,
        isLoading,
        validateField,
        handleSubmit,
    };
}