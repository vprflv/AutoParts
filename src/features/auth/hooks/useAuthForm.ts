// src/features/auth/hooks/useAuthForm.ts
import { useState } from "react";
import { z } from "zod";
import { useAuthStore } from "@/src/store/useAuthStore";

const registerSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
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

    // ✅ Добавили валидацию отдельного поля
    const validateField = (field: "name" | "email" | "password") => {
        try {
            if (tab === "register" && field === "name") {
                registerSchema.shape.name.parse(name);
                setErrors(prev => ({ ...prev, name: "" }));
            } else if (field === "email") {
                const schema = tab === "register" ? registerSchema.shape.email : loginSchema.shape.email;
                schema.parse(email);
                setErrors(prev => ({ ...prev, email: "" }));
            } else if (field === "password") {
                const schema = tab === "register" ? registerSchema.shape.password : loginSchema.shape.password;
                schema.parse(password);
                setErrors(prev => ({ ...prev, password: "" }));
            }
        } catch (err: any) {
            const message = err?.issues?.[0]?.message || err?.errors?.[0]?.message || "Неверное значение";
            setErrors(prev => ({ ...prev, [field]: message }));
        }
    };

    const validateForm = (): boolean => {
        try {
            if (tab === "register") {
                registerSchema.parse({ name, email, password });
                if (!agreePolicy) {
                    setErrors(prev => ({ ...prev, policy: "Необходимо согласиться с политикой" }));
                    return false;
                }
            } else {
                loginSchema.parse({ email, password });
            }

            setErrors({ name: "", email: "", password: "", policy: "" });
            return true;
        } catch (err: any) {
            const newErrors = { name: "", email: "", password: "", policy: "" };

            if (err?.errors) {
                err.errors.forEach((error: any) => {
                    const field = error.path[0] as keyof typeof newErrors;
                    if (field) newErrors[field] = error.message;
                });
            }
            setErrors(newErrors);
            return false;
        }
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
            success = await login(email, password); // сделал async на случай будущих API-запросов
            if (!success) {
                setErrors(prev => ({ ...prev, email: "Неверный email или пароль" }));
            }
        } else if (tab === "register") {
            success = await register(name, email, password);
            if (!success) {
                setErrors(prev => ({ ...prev, email: "Пользователь с таким email уже существует" }));
            }
        }

        setIsLoading(false);
        return success;
    };

    return {
        tab,
        setTab,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        agreePolicy,
        setAgreePolicy,
        errors,
        isLoading,
        validateField,
        validateForm,
        handleSubmit,
    };
}