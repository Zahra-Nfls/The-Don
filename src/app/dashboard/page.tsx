        'use client';
        import { useState, useEffect } from 'react';
        // import Modal from '../../components/Modal'; 
        import { signOut } from 'next-auth/react';
        import Link from 'next/link';
        import { LuCalendarSearch } from "react-icons/lu";
        import { FaHistory } from "react-icons/fa";
        import { FaMoneyBills } from "react-icons/fa6";
        import { BsCalendarEventFill } from "react-icons/bs";
        import { LiaMoneyBillSolid } from "react-icons/lia";
        import Image from 'next/image';
        import money from '@/assets/img/money.png'
        import { IoLogOut } from "react-icons/io5";




        type Event = {
            _id: string;
            date: string;
            startTime: string;
            endTime: string;
            location: string;
            hourSalary: number;
        };

        type Bill = {
            id: string; 
            name: string;
            dueDate: string;
            amount: number;
            isPaid: boolean;
        };



        const Dashboard: React.FC = () => {
            // const [searchDate, setSearchDate] = useState<string>('');
            // const [searchResults, setSearchResults] = useState<Event[]>([]);
            const [eventHistory, setEventHistory] = useState<Event[]>([]);
            // const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
            // const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
            const [totalWorkedHours, setTotalWorkedHours] = useState<number>(0);
            const [totalSalary, setTotalSalary] = useState<number>(0);
            const [currentMonthHours, setCurrentMonthHours] = useState<number>(0);
            const [currentMonthSalary, setCurrentMonthSalary] = useState<number>(0);
            const [isHoveringBills, setIsHoveringBills] = useState(false);
            const [totalAmount, setTotalAmount] = useState(0); 
            const [billHistory, setBillHistory] = useState<Bill[]>([]);
            




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
                fetchBills();
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

            


            // const handleSearch = async () => {
            //     try {
            //         const response = await fetch(`/api/events?date=${searchDate}`);
            //         const data = await response.json();
            //         setSearchResults(data);
            //     } catch (error) {
            //         console.error('Error fetching search results:', error);
            //     }
            // };



            const handleLogout = () => {
                signOut({ callbackUrl: '/login' });
            };



            // const handleRefreshSearch = () => {
            //     setSearchDate(''); // Clear the search date
            //     setSelectedEvent(null); // Clear the selected event
            // };



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



            return (
                <div className='flex flex-col'>
                    <header className="flex justify-between mt-6 mx-6 mb-20">
                        <button onClick={handleLogout} className=" mr-5 text-red-500"><IoLogOut size={45}  /></button>
                    <nav className='flex justify-start gap-5 ml-5 items-center p-5  '>
                        <Link href="/history">
                            <button className=" text-black transform hover:scale-110 transition-transform duration-300">
                            <BsCalendarEventFill size={32} />
                            </button>
                        </Link>
                        {/* <button onClick={() => setIsSearchModalOpen(true)} className=" px-4 py-2 bg-yellow-500 text-white rounded-md">
                        <LuCalendarSearch size={24}/>
                        </button> */}
                        <Link href="/bills">
                                <button
                        className=" text-black transform hover:scale-110 transition-transform duration-300 "
                        // onMouseEnter={() => setIsHoveringBills(true)}
                        // onMouseLeave={() => setIsHoveringBills(false)}
                    >
                                {/* <LiaMoneyBillSolid size={40}/> */}
                                <Image className="w-11" src={money} alt='bills'/>
                    </button>
                        </Link>
                    </nav>
                    </header>

                    <div>
                    <div className="h-96 w-full flex justify-center items-center mb-32 mt-32">
        
                    {/* Balance Overview */}
                    <div className="flex flex-col justify-center items-center my-5 mb-32">
                        {/* Annual Results */}
                        <div className="flex flex-row justify-center items-center my-5">
                            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                <p className="font-semibold text-lg">Total Worked Hours (Annual)</p>
                                <p className="text-xl">{totalWorkedHours.toFixed(2)} hours</p>
                            </section>
                            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                <p className="font-semibold text-lg">Total Salary (Annual)</p>
                                <p className="text-xl">€{totalSalary.toFixed(2)}</p>
                            </section>
                        </div>

                        {/* Current Month Results */}
                        <div className="flex flex-row justify-center items-center my-5">
                            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                <p className="font-semibold text-lg">Current Month Worked Hours</p>
                                <p className="text-xl">{currentMonthHours.toFixed(2)} h</p>
                            </section>
                            <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                <p className="font-semibold text-lg">Current Month Salary</p>
                                <p className="text-xl">€{currentMonthSalary.toFixed(2)}</p>
                            </section>
                        </div>

                        {/* Total Bills Section */}
                            <div className="flex flex-row justify-center items-center my-5">
                                                <section className="mx-10 p-6 bg-gray-200 bg-opacity-60 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-center flex-col items-center">
                                                    <p className="font-semibold text-lg">Total Amount of Bills</p>
                                                    <p className="text-xl">€{totalAmount.toFixed(2)}</p> {/* Display total amount */}
                                                </section>
                                            </div>
                                    
                                </div>
                            </div>


                        {/* Search Event Modal */}
                            {/* {isSearchModalOpen && (
                                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-auto relative">
                                        <button
                                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                            onClick={() => {
                                                setIsSearchModalOpen(false);
                                                setSearchDate(''); 
                                            }}
                                        >
                                            &times; 
                                        </button>
                                        <h2 className="text-lg font-bold mb-4 text-center">Search Event by Date</h2>
                                        <div className="flex justify-between items-center w-full mb-2 mt-2 ">
                                        </div>
                                        <input
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                            className="mb-4 border border-gray-400 p-2 w-full"
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            )} */}


                    {/* Modal for displaying search results */}
                        {/* {searchResults.length > 0 && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-auto relative">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                    onClick={() => setSearchResults([])}
                                >
                                    &times;
                                </button>
                                <h2 className="text-lg font-bold mb-2 mt-2 text-center ">Search Results</h2>
                                <div className="mt-4 max-h-60 overflow-y-auto">
                                    {searchResults.map((event) => (
                                        <div key={event.id} className="mb-2 border-b pb-2">
                                            <p><strong>Date:</strong> {event.date}</p>
                                            <p><strong>Location:</strong> {event.location}</p>
                                            <button
                                                className="text-blue-500"
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setIsSearchModalOpen(false); 
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Modal for displaying selected event */}
                        {/* {selectedEvent && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-auto relative">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    &times; 
                                </button>
                                <button
                                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 "
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        setIsSearchModalOpen(true); // Reopen the search modal
                                    }}
                                >
                                    &#8592; 
                                </button>
                                <h2 className="text-lg font-bold mb-2 mt-2 text-center" >Event Details</h2>
                                <p><strong>Date:</strong> {selectedEvent.date}</p>
                                <p><strong>Hourly Salary:</strong> {selectedEvent.hourSalary}</p>
                                <p><strong>Start Time:</strong> {selectedEvent.startTime}</p>
                                <p><strong>End Time:</strong> {selectedEvent.endTime} </p>
                                <p><strong>Location:</strong> {selectedEvent.location}</p>
                            </div>
                        </div>
                    )} */}
                </div>
                </div>
            );
        };

        export default Dashboard;
