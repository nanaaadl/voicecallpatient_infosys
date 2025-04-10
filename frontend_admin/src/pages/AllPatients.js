import React, { useState, useEffect } from 'react';
import './AllPatients.css';
import { SearchOutlined} from '@ant-design/icons';

const AllPatientRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/patients');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching all patients:', error);
            }
        };
        fetchAllPatients();
    }, []);

    return (
        <div>
            <h1>All Patient Records</h1>
            <div className="search-bar">
                <SearchOutlined className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for patients"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {patients.length === 0 ? (
                <div>No patients found.</div>
            ) : (
                patients.map(patient => (
                    <div key={patient._id}>
                        <h3>{patient.firstName} {patient.lastName}</h3>
                        <div>ID: {patient.customId}</div>
                        <div>DOB: {patient.dateOfBirth}</div> 
                        <div >Phone No: {patient.contactNumber}</div> 
                        <div> Email: {patient.email}</div>
                        <div>Address: {patient.address}</div>
                        <div> Sex: {patient.gender}</div>
                        <div>Room No.: {patient.roomNumber}</div>
                        <div>Bed No.: {patient.bedNumber}</div>
                        <div>Condition: {patient.condition}</div>
                        <div>Status: {patient.requestStatus}</div>
                        <div>Medical History: {patient.medicalHistory}</div>
                        <div>Allergies: {patient.allergies}</div>
                        <div>Current Medications: {patient.currentMedications}</div>
                        <div>Date of Admission: {patient.admittedDate}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllPatientRecords;