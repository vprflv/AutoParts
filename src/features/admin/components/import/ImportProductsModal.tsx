"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useImportProductsMutation } from "@/src/features/admin/hooks/useImportProductsMutation";
import ImportUploadStep from "./ImportUploadStep";
import ImportPreviewStep from "./ImportPreviewStep";
import { toast } from "react-hot-toast";
import {useProductImport} from "@/features/admin/hooks/product-import";


interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportProductsModal({ isOpen, onClose }: ImportProductsModalProps) {
    const importMutation = useImportProductsMutation();

    const{parseImportFile}=useProductImport()

    const [step, setStep] = useState<"upload" | "preview" | "saving">("upload");
    const [previewData, setPreviewData] = useState<any>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);

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
        if (!previewData) return;

        setStep("saving");

        try {
            const allProducts = [...previewData.toAdd, ...previewData.toUpdate];
            await importMutation.mutateAsync(allProducts);

            toast.success("Импорт успешно завершён!");
            setTimeout(() => onClose(), 1400);
        } catch (err: any) {
            setStep("preview");
            toast.error(err.message || "Ошибка при сохранении");
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
                <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {step === "upload" && "Импорт товаров из Excel"}
                            {step === "preview" && "Предпросмотр импорта"}
                            {step === "saving" && "Выполняется импорт..."}
                        </h2>
                    </div>
                    <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
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
                            <p className="text-xl text-zinc-300">Выполняется импорт товаров...</p>
                            <p className="text-zinc-500 mt-2">Сохранение в базу данных</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}