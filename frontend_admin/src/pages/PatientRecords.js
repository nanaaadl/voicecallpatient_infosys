import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientRecords.css';
import PatientNavigation from '../components/PatientNavigation';
import { FaUserCircle } from 'react-icons/fa';
import { Button, message, Modal } from 'antd';

const PatientRecords = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/patients/${id}`);
                const data = await response.json();
                setPatient(data);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };
        fetchPatient();
    }, [id]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/patients/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                message.success('Patient record deleted successfully');
                navigate('/patients'); // Redirect after delete
            } else {
                message.error('Failed to delete patient record');
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            message.error('An error occurred while deleting');
        } finally {
            setLoading(false);
        }
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="records-container">
            <div className="records-header">
                <h1>Records Management</h1>
            </div>
            <div className="patient-info">
                <div className="profile-icon">
                    <FaUserCircle size={60} />
                </div>
                <div className="patient-details">
                    <h2>{patient.firstName} {patient.lastName}</h2>
                    <div>ID: {patient.customID}</div>
                    <div>DOB: {patient.dob}</div>
                    <div>Phone No: {patient.contactNumber}</div>
                    <div>Email: {patient.email}</div>
                    <div>Address: {patient.address}</div>
                    <div>Sex: {patient.gender}</div>
                    <div>Room No.: {patient.roomNumber}</div>
                    <div>Bed No.: {patient.bedNumber}</div>
                    <div>Condition: {patient.condition}</div>
                    <div>Medical History: {patient.medicalHistory}</div>
                    <div>Allergies: {patient.allergies}</div>
                    <div>Current Medications: {patient.currentMedications}</div>
                    <div>Date of Admission: {patient.admittedDate}</div>
                </div>
            </div>
            
            <div className="patient-actions">
                <Button type="primary" onClick={() => navigate(`/patients/edit/${id}`)}>Edit</Button>
                <Button type="danger" onClick={() => setIsModalVisible(true)} loading={loading}>
                    Delete
                </Button>
            </div>

            <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsModalVisible(false)}
                okText="Yes, Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this patient record? This action cannot be undone.</p>
            </Modal>

            <PatientNavigation selected="patients" />
        </div>
    );
};

export default PatientRecords;

