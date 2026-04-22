
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {useAdminProducts} from "@/src/features/admin/hooks/useAdminProducts";
import ImportUploadStep from "@/src/features/admin/components/import/ImportUploadStep";
import ImportPreviewStep from "@/src/features/admin/components/import/ImportPreviewStep";


interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportProductsModal({ isOpen, onClose }: ImportProductsModalProps) {
    const { addOrUpdateProducts, products: existingProducts } = useAdminProducts();

    const [step, setStep] = useState<"upload" | "preview">("upload");
    const [previewData, setPreviewData] = useState<any>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Полный сброс формы при возврате на шаг загрузки
    const handleBackToUpload = () => {
        setStep("upload");
        setPreviewData(null);
        setExcelFile(null);      // ← важно!
        setImageFiles([]);       // ← важно!
    };

    const handlePreviewReady = (data: any) => {
        setPreviewData(data);
        setStep("preview");
    };

    const handleConfirmImport = () => {
        if (previewData) {
            addOrUpdateProducts([...previewData.toAdd, ...previewData.toUpdate]);
            alert(`Импорт завершён!\nДобавлено: ${previewData.toAdd.length}\nОбновлено: ${previewData.toUpdate.length}`);
            onClose();
        }
    };

    // Сброс при закрытии модалки
    const handleClose = () => {
        setStep("upload");
        setPreviewData(null);
        setExcelFile(null);
        setImageFiles([]);
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
                            {step === "upload" ? "Импорт товаров" : "Предпросмотр импорта"}
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {step === "preview" && previewData &&
                                `Новых: ${previewData.toAdd.length} | Обновлений: ${previewData.toUpdate.length}`}
                        </p>
                    </div>
                    <button onClick={handleClose} className="text-zinc-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                {/* Содержимое */}
                <div className="flex-1 overflow-auto">
                    {step === "upload" ? (
                        <ImportUploadStep
                            onPreviewReady={handlePreviewReady}
                            excelFile={excelFile}
                            setExcelFile={setExcelFile}
                            imageFiles={imageFiles}
                            setImageFiles={setImageFiles}
                            existingProducts={existingProducts}
                        />
                    ) : (
                        <ImportPreviewStep
                            previewData={previewData}
                            onConfirm={handleConfirmImport}
                            onBack={handleBackToUpload}     // ← используем полный сброс
                        />
                    )}
                </div>
            </div>
        </div>
    );
}