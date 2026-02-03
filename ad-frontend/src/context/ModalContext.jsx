import { createContext, useState, useCallback } from 'react';
import Modal from '../components/shared/Modal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'info', // 'success', 'error', 'warning', 'info'
        title: '',
        message: '',
        onConfirm: null,
        confirmText: 'OK',
        cancelText: 'Cancel',
    });

    const showModal = useCallback(({ type = 'info', title, message, onConfirm, confirmText = 'OK', cancelText = 'Cancel' }) => {
        setModalConfig({
            isOpen: true,
            type,
            title,
            message,
            onConfirm,
            confirmText,
            cancelText,
        });
    }, []);

    const hideModal = useCallback(() => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={hideModal}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />
        </ModalContext.Provider>
    );
};
