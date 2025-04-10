import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NurseRecords.css';
import NurseNavigation from '../components/NurseNavigation';
import { FaCalendarAlt, FaPhoneAlt, FaEdit, FaTrash, FaUserNurse } from 'react-icons/fa'; // Import FaTrash

const NurseRecords = () => {
    const { id } = useParams();
    const [nurse, setNurse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleData, setScheduleData] = useState([]);
    const [showContact, setShowContact] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isCreatingShift, setIsCreatingShift] = useState(false);
    const [newShift, setNewShift] = useState({
        nurseId: id,
        startTime: '',
        endTime: '',
        date: '',
        floor: '',
        unit: '',
    });
    const fetchSchedule = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/shifts/nurse/${id}/shifts`);
            if (response.ok) {
                const data = await response.json();
                setScheduleData(data);
            } else {
                console.error('Failed to fetch schedule for this nurse.');
                setScheduleData([]);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setScheduleData([]);
        }
    };
    useEffect(() => {
        const fetchNurse = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/nurses/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch nurse details');
                }
                const data = await response.json();
                setNurse(data);
                setEditFormData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNurse();
        if (showSchedule) {
            fetchSchedule();
        }
    }, [id, showSchedule]);

    const toggleSchedule = () => {
        setShowSchedule(!showSchedule);
        if (!showSchedule && scheduleData.length === 0) {
            fetchSchedule();
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleEditInputChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateNurse = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5001/api/nurses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });
            if (response.ok) {
                const updatedNurse = await response.json();
                setNurse(updatedNurse);
                setIsEditing(false);
                alert('Nurse details updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error updating nurse: ${errorData.message || 'Failed to update'}`);
            }
        } catch (error) {
            console.error('Error updating nurse:', error);
            alert('Failed to update nurse details.');
        }
    };

    const toggleContact = () => {
        setShowContact(!showContact);
    };

    const toggleCreateShift = () => {
        setIsCreatingShift(!isCreatingShift);
    };

    const handleNewShiftInputChange = (e) => {
        setNewShift({ ...newShift, [e.target.name]: e.target.value });
    };

    const handleCreateNewShift = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/shifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newShift),
            });
            if (response.ok) {
                alert('New shift created successfully!');
                setNewShift({ ...newShift, startTime: '', endTime: '', date: '', floor: '', unit: '' });
                setIsCreatingShift(false);
                fetchSchedule();
            } else {
                const errorData = await response.json();
                alert(`Error creating shift: ${errorData.message || 'Failed to create'}`);
            }
        } catch (error) {
            console.error('Error creating shift:', error);
            alert('Failed to create new shift.');
        }
    };

    const handleDeleteShift = async (shiftId) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/shifts/${shiftId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Shift deleted successfully!');
                    fetchSchedule(); // Refetch schedule after deletion
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting shift: ${errorData.message || 'Failed to delete'}`);
                }
            } catch (error) {
                console.error('Error deleting shift:', error);
                alert('Failed to delete shift.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!nurse) return <p>No nurse found.</p>;

    return (
        
        <div className="nurse-records-container">
            
                <div className="nurse-icon">
                    <FaUserNurse size={80} />
                 </div>
            <h1>Nurse Details</h1>
            <div className="nurse-details-header">
                <h2>{nurse.firstName} {nurse.lastName}</h2>
                <button className="edit-button" onClick={toggleEdit}>
                    <FaEdit /> Edit
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdateNurse} className="edit-nurse-form">
                    {/* ... Edit form fields ... */}
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" name="firstName" value={editFormData.firstName || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={editFormData.lastName || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={editFormData.email || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Contact:</label>
                        <input type="text" name="contactNumber" value={editFormData.contactNumber || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Department:</label>
                        <input type="text" name="department" value={editFormData.department || ''} onChange={handleEditInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select name="status" value={editFormData.status || ''} onChange={handleEditInputChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={toggleEdit}>Cancel</button>
                </form>
            ) : (
                <div className="nurse-details">
                    <p><strong>ID:</strong> {nurse.customId}</p>
                    <p><strong>Name:</strong> {nurse.firstName} {nurse.lastName}</p>
                    <p><strong>Email:</strong> {nurse.email}</p>
                    <p><strong>Contact:</strong> {nurse.contactNumber}</p>
                    <p><strong>Department:</strong> {nurse.department}</p>
                    <p><strong>Status:</strong> {nurse.status}</p>
                    {nurse.employmentStatus && <p><strong>Employment Status:</strong> {nurse.employmentStatus}</p>}
                </div>
            )}

            <div className="checkbox-options">
                <label>
                    <input type="checkbox" checked={showSchedule} onChange={toggleSchedule} />
                    <FaCalendarAlt className="icon" /> Schedule
                </label>
                <label>
                    <input type="checkbox" checked={showContact} onChange={toggleContact} />
                    <FaPhoneAlt className="icon" /> Contact Information
                </label>
            </div>

            <div className="shift-management">
                <h3>Manage Shifts</h3>
                <button onClick={toggleCreateShift}>
                    {isCreatingShift ? 'Cancel New Shift' : 'Create New Shift'}
                </button>

                {isCreatingShift && (
                    <form onSubmit={handleCreateNewShift} className="create-shift-form">
                        <div className="form-group">
                            <label>Date:</label>
                            <input type="date" name="date" value={newShift.date} onChange={handleNewShiftInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Start Time:</label>
                            <input type="time" name="startTime" value={newShift.startTime} onChange={handleNewShiftInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>End Time:</label>
                            <input type="time" name="endTime" value={newShift.endTime} onChange={handleNewShiftInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Floor:</label>
                            <input type="text" name="floor" value={newShift.floor} onChange={handleNewShiftInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Unit:</label>
                            <input type="text" name="unit" value={newShift.unit} onChange={handleNewShiftInputChange} />
                        </div>
                        <button type="submit" className="save-button">Create Shift</button>
                    </form>
                )}
            </div>

            {showSchedule && (
                <div className="schedule">
                    <h3><FaCalendarAlt className="icon" /> Schedule</h3>
                    {scheduleData.length > 0 ? (
                        scheduleData.map((shift, index) => (
                            <div key={shift._id} className="schedule-item"> {/* Key should be the shift's _id */}
                                {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()} on {new Date(shift.date).toLocaleDateString()} (Floor: {shift.floor || 'N/A'}, Unit: {shift.unit || 'N/A'})
                                <button className="delete-shift-button" onClick={() => handleDeleteShift(shift._id)}>
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No schedule available for this nurse.</p>
                    )}
                </div>
            )}
            {showContact && (
                <div className="contact-info">
                    <h3><FaPhoneAlt className="icon" /> Contact Information</h3>
                    {nurse.contactNumber && <div className="contact-item">Contact: {nurse.contactNumber}</div>}
                    {nurse.email && <div className="contact-item">Email: {nurse.email}</div>}
                </div>
            )}

            <NurseNavigation selected="nurses" />
        </div>
    );
};

export default NurseRecords;
