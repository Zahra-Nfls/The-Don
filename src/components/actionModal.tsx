import { FaEdit, FaTrash, FaCheck, FaMoneyBillWave } from 'react-icons/fa';
import React, { useState } from 'react';
import PaymentDetailsModal from '@/components/payModal'; 
import { FaTimes } from 'react-icons/fa';
import { FaUndo } from "react-icons/fa";

interface Bill {
    _id: string;
    name: string;
    dueDate: string;
    amount: number;
    isPaid: boolean; 
    paymentDate?: string;
    receivedDate?: string; 
    bankAccount?: string;
    comment?: string; 
}

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: Bill | null; 
    onEdit: (bill: Bill) => void; 
    onDelete: (bill: Bill) => void; 
    onMarkAsPaid: (bill: Bill) => void; 
    onPaymentDetails: (bill: Bill) => void;
    recentlyPaidBill: Bill | null; // Add this line
    handleUndoPayment: () => void; // Add this line
}

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    bill,
    onEdit,
    onDelete,
    onMarkAsPaid,
    onPaymentDetails,
    recentlyPaidBill, // Destructure the prop
    handleUndoPayment, // Destructure the prop
}) => {
    
    const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false); // State for payment details modal

    if (!isOpen || !bill) return null;

    const handleEdit = () => {
        onEdit(bill);
        onClose(); 
    };

    const handleDelete = () => {
        onDelete(bill); 
        onClose(); 
    };

    const handleMarkAsPaid = () => {
        onMarkAsPaid(bill); 
        onClose(); 
    };

    const handlePaymentDetailsClick = () => {
        setIsPaymentDetailsModalOpen(true); // Open PaymentDetailsModal
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-50 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"> <FaTimes /> </button>
                <h2 className="text-lg font-bold mt-4 mb-4 text-center">Actions for:  {bill.name}</h2>
                <div className="flex flex-col space-y-2 p-2">
                    <button onClick={handleEdit} className="flex items-center">
                        <FaEdit className="text-blue-500 mr-2" /> Edit
                    </button>
                    <button onClick={handleDelete} className="flex items-center">
                        <FaTrash className="text-red-500 mr-2" /> Delete
                    </button>
                    <button onClick={handlePaymentDetailsClick} className="flex items-center">
                        <FaMoneyBillWave className="text-yellow-500 mr-2" /> Payment Details
                    </button>
                    <button onClick={handleMarkAsPaid} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" /> Mark as Paid
                    </button>
                    <div >
                        {recentlyPaidBill && (
                            <button className='flex flex-row' onClick={handleUndoPayment}
                            > 
                            <FaUndo className=" text-red-500 mr-2 mt-1"/> Undo Payment
                            </button>
                        )}
                    </div>
                    </div>
            </div>

            {/* Render the PaymentDetailsModal conditionally */}
            <PaymentDetailsModal
                isOpen={isPaymentDetailsModalOpen}
                onClose={() => setIsPaymentDetailsModalOpen(false)} // Close function for PaymentDetailsModal
                bill={bill}
            />

                

        </div>
    );
};

export default ActionModal;
