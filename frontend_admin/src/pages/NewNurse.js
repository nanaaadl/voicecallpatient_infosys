import React, { useState } from 'react';
import './NewNurse.css';
import NurseNavigation from '../components/NurseNavigation';


const NewNurse = () => {
    const [formData, setFormData] = useState({ 
        firstName: '',
        lastName: '',
        department: '',
        role: '',
        contactNumber: '',
        email: '',
        licenseNumber: '',
        username:'',
        password: ''
    });
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/nurses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
        console.log("Server response:", result);
            if (response.ok) {
                setAlertMessage('Profile saved successfully!');
                setFormData({  
                    firstName: '',
                    lastName: '',
                    department: '',
                    role: '',
                    contactNumber: '',
                    email: '',
                    licenseNumber: '',
                     username:'',
                     password: ''
                });
                setTimeout(() => setAlertMessage(''), 3000);
            } else {
                setAlertMessage(`Error: ${result.message || "Saving details failed"}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Server error.');
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-header">
                <h1>Nurse Sign Up</h1>
            </div>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Nurse Registration Form</h2>
                <div className="form-group">
                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <select name="role" onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="Registered Nurse">Registered Nurse</option>
                        <option value="Medical Assistant">Medical Assistant</option>
                        <option value="Ward Staff">Ward Staff</option>
                    </select>
                </div>
                <div className="form-group">
                    <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="licenseNumber" placeholder="License Number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="password" placeholder="Password" onChange={handleChange} required />
                </div>
                <button className="submit-button" type="submit">Submit</button>
            </form>
            {alertMessage && <div className="alert-message">{alertMessage}</div>}
            <NurseNavigation selected="nurses" />
        </div>
    );
};

export default NewNurse;