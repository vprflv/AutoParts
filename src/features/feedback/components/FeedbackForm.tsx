"use client";

import { useState } from "react";
import { useFeedbackForm } from "../hooks/useFeedbackForm";

interface FeedbackFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function FeedbackForm({ onSuccess, onClose }: FeedbackFormProps) {
    const {
        formData,
        agreePolicy,
        isSubmitting,
        handleChange,
        handlePhoneChange,
        setAgreePolicy,
    } = useFeedbackForm();

    const [phoneError, setPhoneError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError("");

        if (!formData.phone || formData.phone.length < 10) {
            setPhoneError("Введите номер телефона");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1300));
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Имя</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                    placeholder="Иван Иванов"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Телефон <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={16}
                        className={`w-full bg-zinc-800 border rounded-2xl px-5 py-4 focus:outline-none text-base transition-colors
                            ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-cyan-400'}`}
                        placeholder="+7 (999) 123-45-67"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1.5">{phoneError}</p>}
                </div>

                <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-zinc-400 mb-1.5">VIN-код</label>
                <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    maxLength={17}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 uppercase tracking-wider text-base"
                    placeholder="JTDBU4BF3C1234567"
                />
            </div>

            <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Модель автомобиля</label>
                <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 text-base"
                    placeholder="Toyota Camry 2018"
                />
            </div>

            <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Что нужно подобрать?</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:outline-none focus:border-cyan-400 resize-y min-h-[110px] text-base"
                    placeholder="Нужны тормозные диски + колодки..."
                />
            </div>

            <div className="flex items-start gap-3 pt-2">
                <input
                    type="checkbox"
                    id="policy"
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className="mt-1.5 w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded focus:ring-cyan-400 cursor-pointer"
                    required
                />
                <label htmlFor="policy" className="text-sm text-zinc-400 leading-relaxed cursor-pointer">
                    Я согласен с{" "}
                    <span className="text-cyan-400 hover:underline">политикой конфиденциальности</span>
                    и даю согласие на обработку персональных данных
                </label>
            </div>

            {/* Главная кнопка в новом стиле */}
            <button
                type="submit"
                disabled={isSubmitting || !agreePolicy}
                className="btn-neon disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Отправляем заявку..." : "Отправить заявку"}
            </button>
        </form>
    );
}