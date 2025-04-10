import React, { useState, useEffect } from 'react';
import './Nurses.css';
import NurseNavigation from '../components/NurseNavigation';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Nurses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [nurses, setNurses] = useState([]);

    useEffect(() => {
        const fetchNurses = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/nurses');
                const data = await response.json();
                setNurses(data);
            } catch (error) {
                console.error('Error fetching nurses:', error);
            }
        };
        fetchNurses();
    }, []);

    const filteredNurses = nurses.filter(nurse =>
        Object.values(nurse).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="nurses-container">
            <h1>Nurse Records</h1>
            <div className="search-bar">
                <SearchOutlined className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for nurses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="nurses-list">
                {filteredNurses.map(nurse => (
                    <div key={nurse._id} className="nurse-card">
                        <div className="nurse-name">{nurse.firstName} {nurse.lastName}</div>
                        <div className="nurse-info">
                            <span>ID: {nurse.customId}</span>
                            <span>Department: {nurse.department}</span>
                        </div>
                        <div className="nurse-role">
                            Role: {nurse.role}
                        </div>
                        <div className="nurse-status">
                            Status: {nurse.status === "Active" ? (
                                <CheckCircleFilled style={{ color: 'green', fontSize: '1.5em' }} />
                            ) : (
                                <span className="absent-circle-x"></span>
                            )}
                        </div>
                        <div className="nurse-requests">
                            Pending Requests: {nurse.pendingRequests}
                             {nurse.pendingRequests === 0 ? <span className="active-dot"></span> : <span className="critical-dot"></span>}
                         </div>
                        <Link to={`/nurses/records/${nurse._id}`} className="more-link">More</Link>
                    </div>
                ))}
            </div>
            
            <NurseNavigation selected="nurses" />
        </div>
    );
};

export default Nurses;
