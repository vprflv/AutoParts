
"use client";

import { X } from "lucide-react";
import { useFeedbackForm } from "../hooks/useFeedbackForm";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const {
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
    } = useFeedbackForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreePolicy) {
            alert("Пожалуйста, согласитесь с политикой конфиденциальности");
            return;
        }

        if (!formData.phone || formData.phone.length < 10) {
            alert("Введите корректный номер телефона");
            return;
        }

        setIsSubmitting(true);

        // Симуляция отправки на сервер
        await new Promise(resolve => setTimeout(resolve, 1300));

        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            resetForm();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg mx-auto overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-2xl font-semibold">Оставить заявку</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-6">✅</div>
                            <h3 className="text-2xl font-semibold mb-2">Заявка отправлена!</h3>
                            <p className="text-zinc-400">Мы свяжемся с вами в ближайшее время</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Имя *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                    placeholder="Иван Иванов"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Телефон *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        required
                                        maxLength={16}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                        placeholder="+7 (999) 123-45-67"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">VIN-код</label>
                                <input
                                    type="text"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600 uppercase tracking-wider"
                                    placeholder="JTDBU4BF3C1234567"
                                    maxLength={17}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Модель автомобиля</label>
                                <input
                                    type="text"
                                    name="carModel"
                                    value={formData.carModel}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-600"
                                    placeholder="Toyota Camry 2018"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Что нужно подобрать?</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:outline-none focus:border-blue-600 resize-y min-h-[110px]"
                                    placeholder="Нужны тормозные диски + колодки..."
                                />
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="policy"
                                    checked={agreePolicy}
                                    onChange={(e) => setAgreePolicy(e.target.checked)}
                                    className="mt-1 w-5 h-5 accent-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-600"
                                    required
                                />
                                <label htmlFor="policy" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                                    Я согласен с{" "}
                                    <span className="text-blue-500 hover:underline">политикой конфиденциальности</span>
                                    и даю согласие на обработку персональных данных
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !agreePolicy}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 py-4 rounded-2xl font-semibold text-lg transition-all mt-2"
                            >
                                {isSubmitting ? "Отправляем заявку..." : "Отправить заявку"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}