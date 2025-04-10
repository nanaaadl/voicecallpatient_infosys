import React, { useState, useEffect } from 'react';
import './Patients.css';
import PatientNavigation from '../components/PatientNavigation';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/patients');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        Object.values(patient).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="patients-container">
            <h1>Patient Records</h1>
            <div className="search-bar">
                <SearchOutlined className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for patients"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="patients-list">
                {filteredPatients.map(patient => (
                    <div key={patient._id} className="patient-card">
                        <div className="patient-name">{patient.firstName} {patient.lastName}</div>
                        <div className="patient-info">
                            <span>ID: {patient.customId}</span>
                            <span>Room: {patient.roomNumber}</span>
                        </div>
                        <div className="patient-condition">
                            Condition: {patient.condition}
                            {patient.condition === "Critical" ? (
                                <span className="critical-dot"></span>
                            ) : (
                                <span className="stable-dot"></span>
                            )}
                        </div>
                        <div className="patient-status">
                            Request Status: {patient.requestStatus}
                            {patient.requestStatus === "Fulfilled" ? (
                                <CheckCircleFilled style={{ color: 'green', fontSize: '1.5em' }} />
                            ) : (
                                <span className="absent-circle-x"></span>
                            )}
                        </div>
                        <Link to={`/patients/records/${patient._id}`} className="more-link">More</Link>
                    </div>
                ))}
            </div>
            
            <PatientNavigation selected="patients" />
        </div>
    );
};

export default Patients;
