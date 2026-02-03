import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: 'text-green-500 bg-green-50 border-green-100',
    error: 'text-red-500 bg-red-50 border-red-100',
    warning: 'text-amber-500 bg-amber-50 border-amber-100',
    info: 'text-blue-500 bg-blue-50 border-blue-100',
};

const buttonColors = {
    success: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    error: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
};

export default function Modal({ isOpen, onClose, type = 'info', title, message, onConfirm, confirmText, cancelText }) {
    const Icon = icons[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
                    >
                        <div className={clsx("p-6 flex items-start gap-4 border-b", colors[type].replace('text-', 'border-'))}>
                            <div className={clsx("p-3 rounded-full shrink-0", colors[type])}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 font-serif">{title}</h3>
                                <div className="mt-2 text-gray-600 text-sm leading-relaxed">
                                    {message}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            {onConfirm && (
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition text-sm"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className={clsx(
                                    "px-6 py-2 text-white rounded-xl font-bold transition shadow-md active:scale-95 text-sm",
                                    buttonColors[type]
                                )}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
