'use client';  
// Modal.tsx
import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; // Allow children to be passed to the modal
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Don't render anything if not open

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                {children} {/* Render children here */}
            </div>
        </div>
    );
};

export default Modal;
