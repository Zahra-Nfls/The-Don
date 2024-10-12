import React, { useState } from 'react';

type SearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (date: string) => void; // Callback to handle search
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
    const [searchDate, setSearchDate] = useState('');

    const handleSearch = () => {
        onSearch(searchDate); // Call the onSearch prop with the date
        onClose(); // Close the modal after searching
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                <h2>Search Event</h2>
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default SearchModal;
