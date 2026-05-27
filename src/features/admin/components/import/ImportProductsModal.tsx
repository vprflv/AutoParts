"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useImportProductsMutation } from "@/src/features/admin/hooks/useImportProductsMutation";
import ImportUploadStep from "./ImportUploadStep";
import ImportPreviewStep from "./ImportPreviewStep";
import ImportResultModal from "./ImportResultModal";
import { toast } from "react-hot-toast";
import { useProductImport } from "@/features/admin/hooks/product-import";

interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportProductsModal({ isOpen, onClose }: ImportProductsModalProps) {
    const importMutation = useImportProductsMutation();
    const { parseImportFile } = useProductImport();

    const [step, setStep] = useState<"upload" | "preview" | "saving">("upload");
    const [previewData, setPreviewData] = useState<any>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);

    // Локальное состояние для результата
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<any>(null);

    const handlePreviewReady = async (excel: File) => {
        setExcelFile(excel);
        setIsParsing(true);
        try {
            const data = await parseImportFile(excel);
            setPreviewData(data);
            setStep("preview");
        } catch (err: any) {
            toast.error(err.message || "Не удалось обработать файл");
        } finally {
            setIsParsing(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!previewData) return;

        setStep("saving");

        try {
            const allProducts = [...previewData.toAdd, ...previewData.toUpdate];

            if (allProducts.length === 0) {
                toast.error("Нет товаров для импорта");
                setStep("preview");
                return;
            }
            
            const result = await importMutation.mutateAsync({
                productsInput: allProducts,
                fileName: excelFile?.name || "import.xlsx"
            });

            setResultData(result);
            setShowResult(true);

            setTimeout(() => {
                onClose();
            }, 300);

        } catch (err: any) {
            console.error(err);
            setStep("preview");
            toast.error(err.message || "Ошибка импорта");
        }
    };

    const closeResultModal = () => {
        setShowResult(false);
        setResultData(null);

        // Полный сброс состояния
        setStep("upload");
        setPreviewData(null);
        setExcelFile(null);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Основная модалка импорта */}
            <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
                <div className="bg-zinc-900 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            {step === "upload" && "Импорт товаров из Excel"}
                            {step === "preview" && "Предпросмотр импорта"}
                            {step === "saving" && "Выполняется импорт..."}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={importMutation.isPending}
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {step === "upload" && (
                            <ImportUploadStep
                                onPreviewReady={handlePreviewReady}
                                excelFile={excelFile}
                                setExcelFile={setExcelFile}
                                isLoading={isParsing}
                            />
                        )}

                        {step === "preview" && previewData && (
                            <ImportPreviewStep
                                previewData={previewData}
                                onConfirm={handleConfirmImport}
                                onBack={() => setStep("upload")}
                                isLoading={importMutation.isPending}
                            />
                        )}

                        {step === "saving" && (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <Loader2 size={64} className="animate-spin text-zinc-400 mb-6" />
                                <p className="text-xl">Выполняется импорт...</p>
                                <p className="text-zinc-500 mt-2 text-sm">Это может занять 5–15 секунд</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Модалка результата */}
            <ImportResultModal
                isOpen={showResult}
                onClose={closeResultModal}
                type="import"
                result={resultData}
                title="Результат импорта товаров"
            />
        </>
    );
}