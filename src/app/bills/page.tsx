"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaHome, FaSearch } from 'react-icons/fa';
import { MdOutlineAddCircle } from "react-icons/md";
import { FiRefreshCcw } from 'react-icons/fi'; 
import Modal from '@/components/payModal'
import { FaTimes } from 'react-icons/fa';
import { FaEllipsisV } from 'react-icons/fa'; 
import ActionModal from '@/components/actionModal';


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

type NewBillEntry = Omit<Bill, "_id">; 

const Bills: React.FC = () => {
    const [billHistory, setBillHistory] = useState<Bill[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentBill, setCurrentBill] = useState<Bill | null>(null);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [newEntry, setNewEntry] = useState<NewBillEntry>({
        name: '',
        dueDate: '',
        amount: 0,
        isPaid: false,
        receivedDate: '',
        bankAccount: '',
        comment: '',
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [paymentDate, setPaymentDate] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [recentlyPaidBill, setRecentlyPaidBill] = useState<Bill | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await fetch('/api/bills');
            const bills = await response.json();
            setBillHistory(bills);
            calculateTotalAmount(bills); // Calculate total amount on fetch
        } catch (error: unknown) {
            console.error('Failed to fetch bill history:', error instanceof Error ? error.message : error);
        }
    };

    const calculateTotalAmount = (bills: Bill[]) => {
        const total = bills.reduce((sum, bill) => sum + (bill.isPaid ? 0 : bill.amount), 0);
        setTotalAmount(total);
    };

    const handleEditClick = (bill: Bill) => {
        setCurrentBill(bill);
        setIsEditing(true);
    };

    const handleDeleteClick = async (bill: Bill) => {
        try {
            const response = await fetch(`/api/bills?id=${bill._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                (window.location as Location).reload(); 
                setBillHistory((prev) => prev.filter((b) => b._id !== bill._id));
                calculateTotalAmount(billHistory.filter((b) => b._id !== bill._id)); // Recalculate total
            } else {
                console.error('Failed to delete bill:', await response.json());
            }
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    };

    const handleUpdateClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBill) return;

        try {
            const response = await fetch(`/api/bills?id=${currentBill._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: currentBill.name,
                    dueDate: currentBill.dueDate,
                    amount: currentBill.amount,
                }),
            });

            if (response.ok) {
                fetchBills();
                setCurrentBill(null);
                setIsEditing(false);
            } else {
                console.error('Failed to update bill:', await response.json());
            }
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    const handleAddBill = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const billToAdd: NewBillEntry = {
            ...newEntry,
            isPaid: false,
        };
    
        try {
            const response = await fetch('/api/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billToAdd),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add bill');
            }
    
            fetchBills(); // Refresh bill history after adding
            setNewEntry({ 
                name: '', 
                dueDate: '', 
                amount: 0, 
                receivedDate: '', 
                bankAccount: '', 
                comment: '', 
                isPaid: false 
            });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBill) return;

        try {
            const response = await fetch(`/api/bills?id=${currentBill._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPaid: true, paymentDate }),
            });

            if (response.ok) {
                setRecentlyPaidBill(currentBill); // Track the recently paid bill
                fetchBills();
                setIsPaymentModalOpen(false);
                setCurrentBill(null);
                setPaymentDate('');
            } else {
                console.error('Failed to mark bill as paid:', await response.json());
            }
        } catch (error) {
            console.error('Error marking bill as paid:', error);
        }
    };

    const handleMarkAsPaid = (bill: Bill) => {
        setCurrentBill(bill);
        setIsPaymentModalOpen(true); 
        
    };

    const handleUndoPayment = async () => {
        if (!recentlyPaidBill) return;

        try {
            const response = await fetch(`/api/bills?id=${recentlyPaidBill._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPaid: false, paymentDate: null }), // Reset payment status
            });

            if (response.ok) {
                setRecentlyPaidBill(null); // Clear recently paid bill
                fetchBills(); // Refresh bill history
            } else {
                console.error('Failed to undo payment:', await response.json());
            }
        } catch (error) {
            console.error('Error undoing payment:', error);
        }
    };

    const filteredBills = billHistory.filter((bill) =>
        bill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = () => {
        // Reload the page to show all events
        window.location.reload();
    };

    const handlePaymentDetailsClick = (bill: Bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const handleActionClick = (bill: Bill) => {
        setSelectedBill(bill); // Set the selected bill
        setIsModalOpen(true); // Open the action modal
    };

    return (
        <div className="p-4">
            <nav className='flex items-center justify-between gap-2 p-5'>
                <section>
                <button className="transform hover:scale-110 transition-transform duration-300" onClick={handleRefresh}>
                    <FiRefreshCcw size={24} />
                </button>
                </section>
                <section className='flex gap-2 items-center'>
                <Link href="/dashboard">
                    <button className=" p-2  text-black focus:outline-none transform hover:scale-110 transition-transform duration-300">
                        <FaHome size={24} />
                    </button>
                </Link>
                <button className=" p-0  text-black focus:outline-none transform hover:scale-110 transition-transform duration-300" onClick={() => setShowSearchModal(true)}>
                    <FaSearch size={22} />
                </button>
                <button onClick={() => setIsAddModalOpen(true)} className="  text-black focus:outline-none transform hover:scale-110 transition-transform duration-300">
                    <MdOutlineAddCircle size={28} />
                </button>
                </section>
            </nav>
    
            <h2 className="text-xl font-bold mb-4 text-center">Bills</h2>
            <h3 className="text-lg font-bold mb-4 text-center">Total Amount Due: €{totalAmount}</h3>

    
            <ul className="w-50 mx-auto mb-24">
            {filteredBills.map((bill) => (
                <li key={bill._id} className={`flex flex-row items-center justify-between mb-4 border rounded p-4 shadow ${bill.isPaid ? 'bg-green-200' : ''}`}>
                    <div>
                        <span>
                            <strong>Name:</strong>
                            <span className="ml-2">{bill.name}</span>
                            <br />
                        </span>
                        <span>
                            <strong>Amount:</strong>
                            <span className="ml-2">€{bill.amount}</span>
                            <br />
                        </span>
                        <span>
                            <strong>Received Date:</strong>
                            <span className="ml-2">{bill.receivedDate}</span>
                            <br />
                        </span>
                        <span>
                            <strong>Due Date:</strong>
                            <span className="ml-2">{bill.dueDate}</span>
                            <br />
                        </span>
                    </div>
                    <div className="flex space-x-2 mt-2">
                        <button onClick={() => handleActionClick(bill)}>
                            <FaEllipsisV className="text-gray-500" /> {/* Icon to open actions */}
                        </button>
                    </div>
                </li>
            ))}


            <ActionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bill={selectedBill}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onMarkAsPaid={handleMarkAsPaid}
                onPaymentDetails={handlePaymentDetailsClick}
                recentlyPaidBill={recentlyPaidBill} 
                handleUndoPayment={handleUndoPayment} 
            />
        </ul>
    
            
    
            {/* Add Bill Modal */}
            {isAddModalOpen && (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-10 relative">
            <button
                className="absolute top-2 right-2 text-gray-700 p-1"
                onClick={() => {
                    setIsAddModalOpen(false); // Close the modal
                    setNewEntry({ // Reset the newEntry state
                        name: '',
                        dueDate: '',
                        amount: 0,
                        receivedDate: '',
                        bankAccount: '',
                        comment: '',
                        isPaid: false
                    });
                }}
            >
                <FaTimes /> 
            </button>
            <h3 className="text-xl font-bold mb-4">Add New Bill</h3>
            <form onSubmit={handleAddBill}>
                <input
                    type="text"
                    placeholder="Bill Name"
                    value={newEntry.name}
                    onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={newEntry.dueDate}
                    onChange={(e) => setNewEntry({ ...newEntry, dueDate: e.target.value })}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="date"
                    placeholder="Received Date"
                    value={newEntry.receivedDate}
                    onChange={(e) => setNewEntry({ ...newEntry, receivedDate: e.target.value })}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="BE.. - .... - .... - ...."
                    value={newEntry.bankAccount || ''}
                    onChange={(e) => {
                        let value = e.target.value.replace(/\s+/g, '').replace(/-/g, ''); // Remove spaces and dashes

                        // Ensure the value starts with 'BE' and remove any non-digit characters after 'BE'
                        if (!value.startsWith('BE')) {
                            value = 'BE' + value.replace(/\D/g, ''); // Add 'BE' if missing
                        } else {
                            value = 'BE' + value.substring(2).replace(/\D/g, ''); // Keep only digits after 'BE'
                        }

                        // Format the input to 'BE.. - .... - .... - ....'
                        value = value.slice(0, 18); // Limit to 'BE' + 16 digits
                        value = value.replace(/(\d{2})(\d{4})(\d{4})(\d{4})?/, '$1 - $2 - $3 - $4').trim();

                        setNewEntry({ ...newEntry, bankAccount: value });
                    }}
                    className="border p-2 mb-2 w-full"
                />


                <textarea
                    placeholder="Comment"
                    value={newEntry.comment}
                    onChange={(e) => setNewEntry({ ...newEntry, comment: e.target.value })}
                    className="border p-2 mb-2 w-full"
                />
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Add Bill
                </button>
            </form>
        </div>
    </div>
)}
    
            {/* Payment Modal */}
            {isPaymentModalOpen && currentBill && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
                            onClick={() => setIsPaymentModalOpen(false)}
                        >
                            <FaTimes />  {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">Payment for: {currentBill.name}</h3>
                        <form onSubmit={handlePaymentSubmit}>
                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="border p-2 mb-2 w-full"
                                required
                            />
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Submit Payment</button>

                        </form>
                    </div>
                </div>
            )}
    
            {isEditing && currentBill && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1" onClick={() => { setIsEditing(false); setCurrentBill(null); }}>
                            <FaTimes />  {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">Edit Bill</h3>
                        <form onSubmit={handleUpdateClick} className="flex flex-col">
                            <label className="mb-2">Bill Name:</label>
                            <input
                                type="text"
                                placeholder="Bill Name"
                                value={currentBill.name}
                                onChange={(e) => setCurrentBill({ ...currentBill, name: e.target.value })}
                                className="border p-2 mb-4"
                            />
                            <label className="mb-2">Due Date:</label>
                            <input
                                type="date"
                                value={currentBill.dueDate}
                                onChange={(e) => setCurrentBill({ ...currentBill, dueDate: e.target.value })}
                                className="border p-2 mb-4"
                            />
                            <label className="mb-2">Amount:</label>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={currentBill.amount}
                                onChange={(e) => setCurrentBill({ ...currentBill, amount: Number(e.target.value) })}
                                className="border p-2 mb-4"
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Bill</button>
                        </form>
                    </div>
                </div>
            )}
    
            {/* Search Modal */}
            {showSearchModal && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
                            onClick={() => setShowSearchModal(false)}
                        >
                            <FaTimes />  {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">Search Bills</h3>
                        <input
                            type="text"
                            placeholder="Search by Bill Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 mb-2 w-full"
                        />

                        
                    </div>
                </div>
            )}

            
        </div>
    );
    
};

export default Bills;
