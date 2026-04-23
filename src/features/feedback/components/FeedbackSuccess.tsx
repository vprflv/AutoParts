"use client";

interface FeedbackSuccessProps {
    onClose: () => void;
}

export default function FeedbackSuccess({ onClose }: FeedbackSuccessProps) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-semibold mb-3">Заявка отправлена!</h3>
            <p className="text-zinc-400 mb-8">Мы свяжемся с вами в ближайшее время</p>

            <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl font-medium transition-colors"
            >
                Закрыть
            </button>
        </div>
    );
}