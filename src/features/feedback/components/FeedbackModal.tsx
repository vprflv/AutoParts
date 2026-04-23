// src/features/feedback/components/FeedbackModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import FeedbackForm from "./FeedbackForm";
import FeedbackSuccess from "./FeedbackSuccess";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { resetForm } = useFeedbackForm();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = () => {
        setIsSuccess(false);
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg mx-auto
                            max-h-[92vh] md:max-h-[88vh] xl:max-h-[95vh]
                            overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-6 pb-4 border-b border-zinc-800 flex-shrink-0">
                    <h2 className="text-2xl font-semibold">
                        {isSuccess ? "Заявка отправлена" : "Оставить заявку"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-zinc-400 hover:text-white p-2 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Контент */}
                <div className="flex-1 overflow-y-auto md:overflow-y-auto xl:overflow-visible p-5 sm:p-6">
                    {isSuccess ? (
                        <FeedbackSuccess onClose={handleClose} />
                    ) : (
                        <FeedbackForm
                            onSuccess={() => setIsSuccess(true)}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}