"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useImportProductsMutation } from "@/src/features/admin/hooks/useImportProductsMutation";
import { useProductImport } from "@/src/features/admin/hooks/product-import";
import ImportUploadStep from "./ImportUploadStep";
import ImportPreviewStep from "./ImportPreviewStep";
import { toast } from "react-hot-toast";

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

    // Упрощённая функция — только Excel
    const handlePreviewReady = async (excel: File) => {
        setExcelFile(excel);
        setIsParsing(true);

        try {
            const data = await parseImportFile(excel);
            setPreviewData(data);
            setStep("preview");
        } catch (err: any) {
            toast.error(err.message || "Не удалось обработать Excel файл");
            console.error(err);
        } finally {
            setIsParsing(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!excelFile) return;

        setStep("saving");

        try {
            await importMutation.mutateAsync({
                excelFile,
            });

            setTimeout(() => onClose(), 1400);
        } catch (err) {
            setStep("preview");
        }
    };

    const handleClose = () => {
        if (importMutation.isPending) return;

        setStep("upload");
        setPreviewData(null);
        setExcelFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {step === "upload" && "Импорт товаров из Excel"}
                            {step === "preview" && "Предпросмотр импорта"}
                            {step === "saving" && "Выполняется импорт..."}
                        </h2>
                        {previewData && step === "preview" && (
                            <p className="text-zinc-400 text-sm mt-1">
                                Новых: <span className="text-emerald-400">{previewData.toAdd?.length || 0}</span> |
                                Обновлений: <span className="text-amber-400">{previewData.toUpdate?.length || 0}</span>
                            </p>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Контент */}
                <div className="flex-1 overflow-auto">
                    {step === "upload" && (
                        <ImportUploadStep
                            onPreviewReady={handlePreviewReady}   // Теперь принимает только excel
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
                            <p className="text-xl text-zinc-300">Выполняется импорт товаров...</p>
                            <p className="text-zinc-500 mt-2">Сохранение в базу данных</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}