import React, { useState, useEffect } from 'react';
import './AllNurses.css';
import { SearchOutlined } from '@ant-design/icons';
import { FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

const AllNurseRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [nurses, setNurses] = useState([]);
    const [showSchedule, setShowSchedule] = useState({});
    const [nurseSchedules, setNurseSchedules] = useState({});
    const [showContact, setShowContact] = useState({});

    useEffect(() => {
        const fetchAllNurses = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/nurses');
                const data = await response.json();
                setNurses(data);
            } catch (error) {
                console.error('Error fetching all nurses:', error);
            }
        };
        fetchAllNurses();
    }, []);

    const fetchNurseSchedule = async (nurseId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/shifts/nurse/${nurseId}/shifts`);
            if (response.ok) {
                const data = await response.json();
                setNurseSchedules(prev => ({ ...prev, [nurseId]: data }));
            } else {
                console.error('Failed to fetch schedule for nurse:', nurseId);
                setNurseSchedules(prev => ({ ...prev, [nurseId]: [] })); 
            }
        } catch (error) {
            console.error('Error fetching schedule for nurse:', nurseId, error);
            setNurseSchedules(prev => ({ ...prev, [nurseId]: [] })); 
        }
    };

    const toggleSchedule = (id) => {
        setShowSchedule(prev => ({ ...prev, [id]: !prev[id] }));
        if (!nurseSchedules[id] && !showSchedule[id]) {
            fetchNurseSchedule(id);
        }
    };

    const toggleContact = (id) => {
        setShowContact(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const filteredNurses = nurses.filter(nurse =>
        Object.values(nurse).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <h1>All Nurse Records</h1>
            <div className="search-bar">
                <SearchOutlined className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for nurses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {nurses.length === 0 ? (
                <div>No nurses found.</div>
            ) : (
                nurses.map(nurse => (
                    <div key={nurse._id} className="nurse-card">
                        <h3>{nurse.firstName} {nurse.lastName}</h3>
                        <strong><div>ID: {nurse.customId}</div></strong>
                        <strong><div>Department: {nurse.department}</div></strong>
                        <strong><div>Role: {nurse.role}</div></strong>
                        <strong><div>Contact: {nurse.contactNumber}</div></strong>
                        <strong><div>Email: {nurse.email}</div></strong>
                        <strong><div>License Number: {nurse.licenseNumber}</div></strong>
                        <strong><div>Username: {nurse.username}</div></strong>
                        <strong><div>Availability Status: {nurse.status}</div></strong>

                        <div className="checkbox-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={showSchedule[nurse._id] || false}
                                    onChange={() => toggleSchedule(nurse._id)}
                                />
                                Schedule
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={showContact[nurse._id] || false}
                                    onChange={() => toggleContact(nurse._id)}
                                />
                                Contact Information
                            </label>
                        </div>

                        {showSchedule[nurse._id] && (
                            <div className="schedule">
                                <h3><FaCalendarAlt className="icon" /> Schedule</h3>
                                {nurseSchedules[nurse._id]?.length > 0 ? (
                                    nurseSchedules[nurse._id].map((shift, index) => (
                                        <div key={index} className="schedule-item">
                                            {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()} on {new Date(shift.date).toLocaleDateString()} (Floor: {shift.floor || 'N/A'}, Unit: {shift.unit || 'N/A'})
                                        </div>
                                    ))
                                ) : (
                                    <p>No schedule available for this nurse.</p>
                                )}
                            </div>
                        )}

                        {showContact[nurse._id] && (
                            <div className="contact-info">
                                <h3><FaPhoneAlt className="icon" /> Contact Information</h3>
                                <div className="contact-item">Contact: {nurse.contactNumber}</div>
                                <div className="contact-item">Email: {nurse.email}</div>
                            </div>
                        )}
                    </div>
                ))
            )}
            
        </div>
    );
};

export default AllNurseRecords;
