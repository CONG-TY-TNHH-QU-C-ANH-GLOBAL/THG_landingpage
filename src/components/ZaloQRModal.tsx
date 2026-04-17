import { useEffect } from "react";
import { X } from "lucide-react";
import zaloQR from "@/assets/Zalo qr.jpg";

interface ZaloQRModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ZaloQRModal = ({ isOpen, onClose }: ZaloQRModalProps) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-[340px] w-[90vw] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Nhóm Zalo SALE/CS</h3>
                    <p className="text-sm text-gray-500 mb-4">Quét mã QR bằng Zalo để tham gia</p>
                    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <img src={zaloQR} alt="Zalo QR Code - SALE/CS Group" className="w-full h-auto" />
                    </div>
                    <a
                        href="https://zalo.me/g/jhbhjc184"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 mt-4 w-full bg-[#0068FF] hover:bg-[#0055DD] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                    >
                        💬 Mở Zalo để tham gia nhóm
                    </a>
                    <p className="text-xs text-gray-400 mt-2">Desktop: Quét QR bằng app Zalo · Mobile: Nhấn nút phía trên</p>
                </div>
            </div>
        </div>
    );
};

export default ZaloQRModal;
