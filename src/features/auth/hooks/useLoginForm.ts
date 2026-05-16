// src/features/auth/hooks/useLoginForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuthStore } from "@/src/store/useAuthStore";

const loginSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string().min(1, "Введите пароль"),
});

export function useLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const { login, clearError, error: storeError } = useAuthStore();

    // Обработка ошибок от Supabase
    useEffect(() => {
        if (storeError) {
            let message = "Неправильный email или пароль";

            if (storeError.includes("Email not confirmed")) {
                message = "Email не подтверждён. Проверьте почту.";
            } else if (storeError.includes("too many requests")) {
                message = "Слишком много попыток. Подождите немного.";
            } else if (storeError.includes("Invalid login credentials")) {
                message = "Неверный email или пароль.";
            }

            setGeneralError(message);
        } else {
            setGeneralError("");
        }
    }, [storeError]);

    const validateForm = (): boolean => {
        try {
            loginSchema.parse({ email, password });
            setErrors({ email: "", password: "" });
            return true;
        } catch (err: any) {
            const newErrors = { email: "", password: "" };
            if (err?.issues) {
                err.issues.forEach((issue: any) => {
                    const field = issue.path[0] as "email" | "password";
                    if (field) newErrors[field] = issue.message;
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (): Promise<boolean> => {
        setIsLoading(true);
        setErrors({ email: "", password: "" });
        setGeneralError("");
        clearError();

        if (!validateForm()) {
            setIsLoading(false);
            return false;
        }

        try {
            const success = await login(email, password);
            return success;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        errors,
        generalError,
        isLoading,
        handleSubmit,
        validateField: (field: "email" | "password") => {
            // При необходимости можно добавить
        },
    };
}