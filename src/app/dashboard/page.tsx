'use client';
import { useState, useEffect } from 'react';
import Modal from '../../components/Modal'; 
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiRefreshCcw } from 'react-icons/fi'; 
import { LuCalendarSearch } from "react-icons/lu";
import { FaHistory } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";




type Event = {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    hourSalary: number;
};

const Dashboard: React.FC = () => {
    const [searchDate, setSearchDate] = useState<string>('');

    const [eventHistory, setEventHistory] = useState<Event[]>([]);
  
    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    
    const [totalWorkedHours, setTotalWorkedHours] = useState<number>(0);
    const [totalSalary, setTotalSalary] = useState<number>(0);
    const [currentMonthHours, setCurrentMonthHours] = useState<number>(0);
    const [currentMonthSalary, setCurrentMonthSalary] = useState<number>(0);
    const [isHoveringBills, setIsHoveringBills] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0); // Total amount for bills

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/events');
                const events = await response.json();
                if (Array.isArray(events)) {
                    setEventHistory(events);
                } else {
                    console.error('Expected an array of events, got:', events);
                    setEventHistory([]);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEventHistory([]);
            }
        };
        fetchData();
    }, []);

    const calculateTotals = () => {
        const totalHours = eventHistory.reduce((total, event) => {
            const start = new Date(`1970-01-01T${event.startTime}:00`).getTime();
            const end = new Date(`1970-01-01T${event.endTime}:00`).getTime();
            const hoursWorked = (end - start) / (1000 * 60 * 60);
            return total + hoursWorked;
        }, 0);

        setTotalWorkedHours(totalHours);

        const totalSalary = eventHistory.reduce((total, event) => {
            const start = new Date(`1970-01-01T${event.startTime}:00`).getTime();
            const end = new Date(`1970-01-01T${event.endTime}:00`).getTime();
            const hoursWorked = (end - start) / (1000 * 60 * 60);
            return total + (hoursWorked * event.hourSalary);
        }, 0);

        setTotalSalary(totalSalary);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthTotalHours = eventHistory.reduce((total, event) => {
            const eventDate = new Date(event.date);
            if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                const start = new Date(`1970-01-01T${event.startTime}:00`).getTime();
                const end = new Date(`1970-01-01T${event.endTime}:00`).getTime();
                const hoursWorked = (end - start) / (1000 * 60 * 60);
                return total + hoursWorked;
            }
            return total;
        }, 0);

        setCurrentMonthHours(currentMonthTotalHours);

        const currentMonthSalary = eventHistory.reduce((total, event) => {
            const eventDate = new Date(event.date);
            if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                const start = new Date(`1970-01-01T${event.startTime}:00`).getTime();
                const end = new Date(`1970-01-01T${event.endTime}:00`).getTime();
                const hoursWorked = (end - start) / (1000 * 60 * 60);
                return total + (hoursWorked * event.hourSalary);
            }
            return total;
        }, 0);

        setCurrentMonthSalary(currentMonthSalary);
    };

    useEffect(() => {
        calculateTotals();
    }, [eventHistory]);

    

    const handleSearch = () => {
        // Clear the previously selected event before searching
        setSelectedEvent(null);
    
        // Find the event matching the search date
        const event = eventHistory.find((e) => e.date === searchDate);
        if (event) {
            setSelectedEvent(event);
            setIsSearchModalOpen(true);
        } else {
            alert('No events found for this date.');
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    const handleUpdateEvent = async (event: Event) => {
        const response = await fetch(`/api/events`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const updatedEvents = eventHistory.map(e => e._id === event._id ? event : e);
            setEventHistory(updatedEvents);
            alert('Event updated successfully!');
        } else {
            alert('Error updating event');
        }
    };

    const handleDeleteEvent = async (id: string) => {
        const response = await fetch(`/api/events?id=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const updatedEvents = eventHistory.filter(e => e._id !== id);
            setEventHistory(updatedEvents);
            alert('Event deleted successfully!');
        } else {
            alert('Error deleting event');
        }
    };

    const handleRefreshSearch = () => {
        setSearchDate(''); // Clear the search date
        setSelectedEvent(null); // Clear the selected event
    };

    return (
        <div>
            <header className="flex justify-end mt-6 mx-6">
                <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
            </header>
            <nav className='flex justify-start gap-2 ml-5'>
                <Link href="/history">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    <FaHistory size={24}/>
                    </button>
                </Link>
                <button onClick={() => setIsSearchModalOpen(true)} className=" px-4 py-2 bg-yellow-500 text-white rounded-md">
                <LuCalendarSearch size={24}/>
                </button>
                <button>Cerca fatture</button>
                <Link href="/bills">
                        <button
                className="px-4 py-2 ml-5 mb-5 bg-blue-500 text-white rounded-md flex items-center gap-2"
                onMouseEnter={() => setIsHoveringBills(true)}
                onMouseLeave={() => setIsHoveringBills(false)}
            >
                {/* Show "Minchiaaaa 😢" when hovering, show "Da Pagare!" and icon when not hovering */}
                {isHoveringBills ? (
                    'Minchiaaaa 😢'
                ) : (
                    <>
                        Da Pagare! <FaMoneyBills size={24} />
                    </>
                )}
            </button>
                </Link>
            </nav>
            <div className="h-96 w-full flex justify-center items-center">
    {/* Balance Overview */}
    <div className="flex flex-col justify-center items-center my-5">
        {/* Annual Results */}
        <div className="flex flex-row justify-center items-center my-5">
            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">Total Worked Hours (Annual)</p>
                <p className="text-xl">{totalWorkedHours.toFixed(2)} hours</p>
            </section>
            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">Total Salary (Annual)</p>
                <p className="text-xl">${totalSalary.toFixed(2)}</p>
            </section>
        </div>

        {/* Current Month Results */}
        <div className="flex flex-row justify-center items-center my-5">
            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">Current Month Worked Hours</p>
                <p className="text-xl">{currentMonthHours.toFixed(2)} hours</p>
            </section>
            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                <p className="font-semibold text-lg">Current Month Salary</p>
                <p className="text-xl">${currentMonthSalary.toFixed(2)}</p>
            </section>
        </div>

   {/* Total Bills Section */}
            <div className="flex flex-row justify-center items-center my-5">
                                <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                    <p className="font-semibold text-lg">Total Amount of Bills</p>
                                    <p className="text-xl">${totalAmount.toFixed(2)}</p> {/* Display total amount */}
                                </section>
                            </div>
                    
                </div>
            </div>



            {/* Search Event Modal */}
            <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)}>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-between items-center w-full mb-4">
                        <h2 className="text-lg font-bold">Search Event by Date</h2>
                        <button onClick={handleRefreshSearch} className="text-blue-500 mr-5">
                            <FiRefreshCcw size={20} />
                        </button>
                    </div>
                    <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="mb-4 border border-gray-400 p-2" />
                    <button onClick={handleSearch} className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md">Search</button>
                </div>
            </Modal>

            {/* Modal for displaying selected event */}
            {selectedEvent && (
                <Modal isOpen={true} onClose={() => setSelectedEvent(null)}>
                    <h2 className="text-lg font-bold mb-4">Event Details</h2>
                    <p><strong>Date:</strong> {selectedEvent.date}</p>
                    <p><strong>Hourly Salary:</strong> {selectedEvent.hourSalary}</p>
                    <section className='flex justify-center gap-3'>
                    
                    <button>View</button>
                    </section>
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
