import React from 'react';
import { FaTimes } from 'react-icons/fa';

type Bill = {
    _id: string;
    name: string;
    dueDate: string;
    amount: number;
    isPaid: boolean; 
    paymentDate?: string;
    receivedDate?: string; 
    bankAccount?: string;
    comment?: string; 
};

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: Bill | null; // Use the imported Bill type
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ isOpen, onClose, bill }) => {
    if (!isOpen || !bill) return null;

    const handlePayButtonClick = () => {
        // Open the banking app with the payment link
        window.open('https://play.google.com/store/apps/details?id=com.bnpp.easybanking&hl=en', '_blank'); // Replace with your actual bank link
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl  relative text">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-700 p-1"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Payment Details</h2>
                <p>
                    <strong>Amount:</strong> €{bill.amount}
                </p>
                <p>
                    <strong>Bank Account:</strong> {bill.bankAccount}
                </p>
                <p>
                    <strong>Comment:</strong> {bill.comment}
                </p>
                <div className="mt-4">
                    <button 
                        onClick={handlePayButtonClick} 
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsModal;
