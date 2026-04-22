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
    const [tab, setTab] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        policy: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuthStore();

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setAgreePolicy(false);
        setErrors({ name: "", email: "", password: "", policy: "" });
    };

    // Живая валидация при потере фокуса
    const validateField = (field: "name" | "email" | "password") => {
        try {
            if (tab === "register" && field === "name") {
                z.string().min(2, "Имя должно содержать минимум 2 символа").parse(name);
            } else if (field === "email") {
                z.string().email("Введите корректный email").parse(email);
            } else if (field === "password") {
                const schema = tab === "register"
                    ? registerSchema.shape.password
                    : loginSchema.shape.password;
                schema.parse(password);
            }

            setErrors(prev => ({ ...prev, [field]: "" }));
        } catch (err: any) {
            let message = "Ошибка валидации";

            if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                message = err.errors[0].message;
            } else if (typeof err?.message === "string") {
                // Если сообщение — это JSON-массив (как у тебя было)
                try {
                    const parsed = JSON.parse(err.message);
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
                        message = parsed[0].message;
                    } else {
                        message = err.message;
                    }
                } catch {
                    message = err.message;
                }
            }

            setErrors(prev => ({ ...prev, [field]: message }));
        }
    };

    // Основная отправка формы
    const handleSubmit = () => {
        setErrors({ name: "", email: "", password: "", policy: "" });
        setIsLoading(true);

        try {
            if (tab === "register") {
                registerSchema.parse({ name, email, password });
                if (!agreePolicy) {
                    setErrors(prev => ({ ...prev, policy: "Необходимо согласиться с политикой конфиденциальности" }));
                    setIsLoading(false);
                    return false;
                }
            } else {
                loginSchema.parse({ email, password });
            }

            // Если валидация прошла — выполняем действие
            let success = false;

            if (tab === "login") {
                success = login(email, password);
                if (!success) {
                    setErrors(prev => ({ ...prev, email: "Неверный email или пароль" }));
                }
            } else {
                success = register(name, email, password);
                if (!success) {
                    setErrors(prev => ({ ...prev, email: "Ошибка при регистрации" }));
                }
            }

            setIsLoading(false);
            return success;

        } catch (err: any) {
            const newErrors = { name: "", email: "", password: "", policy: "" };

            if (err?.errors && Array.isArray(err.errors)) {
                err.errors.forEach((error: any) => {
                    const field = error.path[0] as "name" | "email" | "password";
                    if (field) {
                        newErrors[field] = error.message;
                    }
                });
            } else if (typeof err?.message === "string") {
                // Если сообщение пришло как JSON-массив
                try {
                    const parsed = JSON.parse(err.message);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        parsed.forEach((error: any) => {
                            const field = error.path[0] as "name" | "email" | "password";
                            if (field) newErrors[field] = error.message;
                        });
                    }
                } catch {
                    newErrors.email = err.message;
                }
            }

            setErrors(newErrors);
            setIsLoading(false);
            return false;
        }
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
        handleSubmit,
        validateField,
        resetForm,
    };
}