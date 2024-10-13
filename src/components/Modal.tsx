import { FC } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Do not render the modal if it is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div>
                <button onClick={onClose} className="absolute top-2 right-2">
                    Close
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
