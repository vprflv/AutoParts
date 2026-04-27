// src/features/auth/hooks/useAuthForm.ts
import { useState } from "react";
import { z } from "zod";
import { useAuthStore } from "@/src/store/useAuthStore";

const registerSchema = z.object({
    name: z.string()
        .min(1, "Имя обязательно")
        .max(50, "Имя слишком длинное")
        .trim(),

    email: z.string().email("Введите корректный email"),

    password: z.string()
        .min(8, "Пароль должен содержать минимум 8 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

const loginSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string().min(1, "Введите пароль"),
});

export function useAuthForm() {
    const [tab, setTab] = useState<"login" | "register" | "forgot">("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        policy: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuthStore();

    const validateField = (field: "name" | "email" | "password") => {
        try {
            if (field === "name") {
                // Простая и надёжная проверка имени
                if (!name || name.trim() === "") {
                    setErrors(prev => ({ ...prev, name: "Имя обязательно" }));
                    return;
                }
                registerSchema.shape.name.parse(name);
            }
            else if (field === "email") {
                const schema = z.string().email("Введите корректный email");
                schema.parse(email);
            }
            else if (field === "password") {
                const schema = registerSchema.shape.password;
                schema.parse(password);
            }

            setErrors(prev => ({ ...prev, [field]: "" }));
        } catch (err: any) {
            const message = err?.issues?.[0]?.message || err?.message || "Неверное значение";
            setErrors(prev => ({ ...prev, [field]: message }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors = { name: "", email: "", password: "", policy: "" };

        // Проверка имени (всегда для регистрации)
        if (!name || name.trim() === "") {
            newErrors.name = "Имя обязательно";
        }

        // Проверка email и password
        try {
            registerSchema.parse({
                name: name.trim(),
                email,
                password
            });
        } catch (err: any) {
            if (err?.issues) {
                err.issues.forEach((issue: any) => {
                    const field = issue.path[0] as keyof typeof newErrors;
                    if (field) newErrors[field] = issue.message;
                });
            }
        }

        if (!agreePolicy) {
            newErrors.policy = "Необходимо согласиться с политикой";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(err => err === "");
    };

    const handleSubmit = async (): Promise<boolean> => {
        setIsLoading(true);
        setErrors({ name: "", email: "", password: "", policy: "" });

        if (!validateForm()) {
            setIsLoading(false);
            return false;
        }

        let success = false;

        if (tab === "login") {
            success = await login(email, password);
        } else if (tab === "register") {
            success = await register(name.trim(), email, password);
        }

        setIsLoading(false);
        return success;
    };

    return {
        tab, setTab,
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