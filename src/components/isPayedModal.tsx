// components/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void; // Function to close the modal
    onSubmit: (accountNumber: string, comment: string) => void; // Handle submission
    children?: React.ReactNode; // Add children prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, onSubmit, children }) => {
    const [accountNumber, setAccountNumber] = React.useState('');
    const [comment, setComment] = React.useState('');

    const handleSubmit = () => {
        onSubmit(accountNumber, comment);
        onRequestClose(); // Close modal after submission
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}
        >
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Add Payment Details</h2>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="border p-2 mt-2 w-full"
                />
                <textarea
                    placeholder="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 mt-2 w-full"
                />
                <div className="mt-4">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white rounded px-4 py-2">
                        Pay
                    </button>
                    <button onClick={onRequestClose} className="bg-gray-300 text-black rounded px-4 py-2 ml-2">
                        Cancel
                    </button>
                </div>
                {/* Render any children passed to the modal */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
