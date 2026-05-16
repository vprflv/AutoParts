import { useState } from "react";

export interface FeedbackFormData {
    name: string;
    phone: string;
    email: string;
    vin: string;
    carModel: string;
    message: string;
}

export function useFeedbackForm() {
    const [formData, setFormData] = useState<FeedbackFormData>({
        name: "",
        phone: "",
        email: "",
        vin: "",
        carModel: "",
        message: "",
    });

    const [agreePolicy, setAgreePolicy] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9+]/g, "");

        // "+" только в начале
        if (value.includes("+") && value.indexOf("+") !== 0) {
            value = value.replace(/\+/g, "");
        }

        // Не больше одного "+"
        value = value.replace(/\+/g, (match, offset) => (offset === 0 ? match : ""));

        if (value.length > 16) value = value.slice(0, 16);

        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "phone") return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            vin: "",
            carModel: "",
            message: "",
        });
        setAgreePolicy(false);
    };

    return {
        formData,
        agreePolicy,
        isSubmitting,
        isSuccess,
        setAgreePolicy,
        setIsSubmitting,
        setIsSuccess,
        handleChange,
        handlePhoneChange,
        resetForm,
    };
}