// src/features/auth/hooks/useRegisterForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuthStore } from "@/src/store/useAuthStore";

const passwordSchema = z.string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(128, "Пароль слишком длинный")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
    .regex(/[^A-Za-z0-9]/, "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)")
    .refine((val) => !val.toLowerCase().includes("password"), "Пароль не может содержать слово 'password'")
    .refine((val) => !/(.)\1{2,}/.test(val), "Пароль не должен содержать три одинаковых символа подряд");

const registerSchema = z.object({
    name: z.string().min(1, "Имя обязательно").max(50, "Имя слишком длинное").trim(),
    email: z.string().email("Введите корректный email"),
    password: passwordSchema,
});

export function useRegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [errors, setErrors] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { register, clearError, error: storeError } = useAuthStore();

    const calculateStrength = (pass: string): number => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return Math.min(strength, 4);
    };

    useEffect(() => {
        setPasswordStrength(calculateStrength(password));
    }, [password]);

    // Обработка ошибок от Supabase
    useEffect(() => {
        if (storeError) {
            let message = storeError;

            if (storeError.includes("User already registered") ||
                storeError.includes("already exists")) {
                message = "Пользователь с таким email уже существует";
            }

            setErrors(prev => ({ ...prev, email: message }));
        }
    }, [storeError]);

    // Валидация отдельного поля (для onBlur)
    const validateField = (field: "name" | "email" | "password") => {
        try {
            if (field === "name") {
                registerSchema.shape.name.parse(name);
            } else if (field === "email") {
                z.string().email("Введите корректный email").parse(email);
            } else if (field === "password") {
                passwordSchema.parse(password);
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
            registerSchema.parse({
                name: name.trim(),
                email,
                password
            });
            setErrors(newErrors);
            return true;
        } catch (err: any) {
            if (err?.issues) {
                err.issues.forEach((issue: any) => {
                    const field = issue.path[0] as keyof typeof newErrors;
                    if (field) newErrors[field] = issue.message;
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (): Promise<boolean> => {
        setIsLoading(true);
        setErrors({ name: "", email: "", password: "" });
        clearError();

        if (!validateForm()) {
            setIsLoading(false);
            return false;
        }

        try {
            const success = await register(name.trim(), email, password);
            return success;
        } catch (err) {
            console.error(err);
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
        passwordStrength,
        validateField,        // ← Добавили
        handleSubmit,
    };
}