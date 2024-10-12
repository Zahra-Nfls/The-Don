"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaHome, FaSearch, FaSync } from 'react-icons/fa';
import { MdOutlineAddCircle } from "react-icons/md";

import Modal from '@/components/Modal';

// Define the Event type
type Event = {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    hourSalary: number;
};

const History: React.FC = () => {
    const [eventHistory, setEventHistory] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [newEntry, setNewEntry] = useState<Event>({
        _id: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        hourSalary: 0,
    });

    // Fetch the event history when the component mounts
    useEffect(() => {
        fetchHistory(); // Call fetchHistory when the component mounts
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/events'); // Fetch events from /api/events
            const events = await response.json();
            console.log('Fetched events:', events); // Log fetched events for debugging

            // Check if response is an array before setting the event history
            if (Array.isArray(events)) {
                setEventHistory(events);
            } else {
                console.error('Expected an array but got:', events);
            }
        } catch (error) {
            console.error('Failed to fetch event history:', error);
        }
    };

    // Handle the edit button click
    const handleEditClick = (event: Event) => {
        setCurrentEvent(event); // Set the event to be edited
        setIsEditing(true); // Enable editing mode
    };

    // Handle delete event
    const handleDeleteClick = async (event: Event) => {
        const { date, startTime, location, _id } = event;

        try {
            const response = await fetch(`/api/events?id=${_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                (window.location as Location).reload(); 
                // Remove the deleted event from the state
                const updatedEvents = eventHistory.filter((e) => e._id !== _id);
                setEventHistory(updatedEvents);
            } else {
                const errorData = await response.json();
                console.error('Failed to delete event:', errorData);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    // Handle updating the event
    const handleUpdateClick = async () => {
        if (!currentEvent) return;
    
        try {
            const response = await fetch(`/api/events?date=${currentEvent.date}&startTime=${currentEvent.startTime}&location=${currentEvent.location}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentEvent), // Send the updated event data
            });
    
            if (response.ok) {
                const updatedEvent: Event = await response.json(); // Type assertion for updated event
                // Update the state with the modified event
                setEventHistory((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === updatedEvent._id ? updatedEvent : event
                    )
                );
                setCurrentEvent(null); // Clear the current event after update
                setIsEditing(false); // Exit editing mode
            } else {
                console.error('Failed to update event:', await response.json());
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    // Filter events based on the search term
    const filteredEvents = eventHistory.filter(event => {
        if (!event) return false; // Skip if event is undefined or null
        return (
            (event.date && event.date.includes(searchTerm)) || // Check if event.date exists
            (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) || // Check if event.location exists
            (event.startTime && event.startTime.includes(searchTerm)) || // Check if event.startTime exists
            (event.endTime && event.endTime.includes(searchTerm)) // Check if event.endTime exists
        );
    });



    const handleAddNewEntry = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
    
        // Check if all fields are filled correctly
        if (!newEntry.date || !newEntry.startTime || !newEntry.endTime || !newEntry.location || newEntry.hourSalary <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }
    
        // Create the new event object
        const newEvent = {
            date: newEntry.date,
            startTime: newEntry.startTime,
            endTime: newEntry.endTime,
            location: newEntry.location,
            hourSalary: newEntry.hourSalary,
        };
    
        try {
            // Send a POST request to the API
            const response = await fetch('/api/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });
    
            // Check if the response is OK
            if (response.ok) {
                const addedEvent = await response.json(); // Get the added event data
                setEventHistory((prevEvents) => [...prevEvents, addedEvent]); // Update the event history
                alert('New event added successfully!');
                fetchHistory(); // Fetch the updated history after adding
            } else {
                throw new Error('Error adding event'); // Handle server errors
            }
        } catch (error) {
            console.error('Error adding event:', error); // Log the error
        }
    
        // Reset input fields and close the modal
        setNewEntry({
            _id: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            hourSalary: 0,
        });
        setIsAddModalOpen(false);
    };
    

    return (
        <div className="p-4">
            <nav className='flex justify-end gap-2'>
                <Link href="/dashboard">
                    <button className="mt-4 p-2 text-blue-500 rounded-md hover:text-blue-700 focus:outline-none">
                        <FaHome size={24} /> {/* Home icon */}
                    </button>
                </Link>
                <button
                    className="mt-4 p-0 text-green-500 hover:text-green-700 focus:outline-none"
                    onClick={() => setShowSearchModal(true)}>
                    <FaSearch size={24} /> 
                </button>

                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md">
                <MdOutlineAddCircle size={24} />
                </button>
                
            </nav>


            <h2 className="text-xl font-bold mb-4 text-center">Event History</h2>

            <ul className="w-1/2 mx-auto mb-24">
                {filteredEvents.map((event) => (
                    <li key={event._id} className="flex flex-row items-center justify-between mb-4 border rounded p-4 shadow">
                        <div>
                            <span>
                                <strong>Date: </strong>
                                <span className="ml-2">{event.date}</span>
                                <br />
                            </span>
                            <span>
                                <strong>From:</strong>
                                <span className="ml-2">{event.startTime}</span>
                                <strong> To:</strong>
                                <span className="ml-2">{event.endTime}</span>
                                <br />
                            </span>
                            <span>
                                <strong>Location:</strong>
                                <span className="ml-2">{event.location}</span>
                                <br />
                            </span>
                            <span>
                                <strong>€/h:</strong>
                                <span className="ml-2">{event.hourSalary.toFixed(2)}</span>
                                <br />
                            </span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                            <button onClick={() => handleEditClick(event)}>
                                <FaEdit className="text-blue-500" />
                            </button>
                            <button onClick={() => handleDeleteClick(event)}>
                                <FaTrash className="text-red-500" /> 
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isEditing && currentEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => { setIsEditing(false); setCurrentEvent(null); }} 
                        >
                            &times; {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-bold mb-4">Edit Event</h3>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            value={currentEvent.date}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                        />
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            value={currentEvent.startTime}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, startTime: e.target.value })}
                        />
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            value={currentEvent.endTime}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, endTime: e.target.value })}
                        />
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            value={currentEvent.location}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                        />
                        <input
                            type="number"
                            className="border p-2 w-full mb-2"
                            value={currentEvent.hourSalary}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, hourSalary: Number(e.target.value) })}
                        />
                        <button onClick={handleUpdateClick} className="bg-blue-500 text-white p-2 rounded">
                            Update Event
                        </button>
                    </div>
                </div>
            )}

                                {/* Add New Entry Modal */}
                <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-auto">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            &times; {/* "X" icon for closing */}
                        </button>
                        <h2 className="text-lg font-bold mb-4">Add New Event</h2>
                        <form onSubmit={handleAddNewEntry} className="flex flex-col">
                            <label className="mb-2">Date:</label>
                            <input
                                type="date"
                                value={newEntry.date}
                                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                className="mb-4 border border-gray-400 p-2"
                            />

                            <label className="mb-2">Start Time:</label>
                            <input
                                type="time"
                                value={newEntry.startTime}
                                onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                                className="mb-4 border border-gray-400 p-2"
                            />

                            <label className="mb-2">End Time:</label>
                            <input
                                type="time"
                                value={newEntry.endTime}
                                onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                                className="mb-4 border border-gray-400 p-2"
                            />

                            <label className="mb-2">Location:</label>
                            <input
                                type="text"
                                value={newEntry.location}
                                onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                                className="mb-4 border border-gray-400 p-2"
                            />

                            <label className="mb-2">Hourly Salary:</label>
                            <input
                                type="number"
                                value={newEntry.hourSalary}
                                onChange={(e) => setNewEntry({ ...newEntry, hourSalary: Number(e.target.value) })}
                                className="mb-4 border border-gray-400 p-2"
                            />

                            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">
                                Add Event
                            </button>
                        </form>
                    </div>
                </Modal>





            {showSearchModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowSearchModal(false)} // Close search modal
                        >
                            &times; {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">Search Events</h3>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                            placeholder="Enter search term..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
