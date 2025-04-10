import React, { useState } from 'react';
import './NewPatient.css';
import PatientNavigation from '../components/PatientNavigation';


const NewPatient = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        contactNumber: '',
        email: '',
        address:'',
        gender: '',
        medicalHistory: '',
        currentMedications:'',
        allergies:'',
        condition: '',
        roomNumber:'',
        bedNumber: '',
        admittedDate:''

    });
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setAlertMessage('Details saved successfully!');
                setTimeout(() => setAlertMessage(''), 3000);
            } else {
                setAlertMessage('Error saving details.');
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Server error.');
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-header">
                <h1>Patient Sign Up</h1>
            </div>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Patient Registration Form</h2>
                <div className="form-group">
                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="date" name="dob" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email Id" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email Id" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <select name="gender" onChange={handleChange} required>
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <textarea name="medicalHistory" placeholder="Medical History" onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <input type="text" name="currentMedications" placeholder="Prior Medications" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="allergies" placeholder="Allergies (if any)" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="condition" placeholder="Current condition" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="date" name="admittedDate" onChange={handleChange} required />
                </div>
                <div className="form-group checkbox-group">
                     <input type="checkbox" id="agree" />
                     <label htmlFor="agree">
                        I agree to receive communications from VocalCare and be contacted via email or SMS for appointment reminders and health updates.
                    </label>
                 </div>
                <div className="form-group">
                    <input type="text" name="roomNumber" placeholder="Room No" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="bedNumber" placeholder="Bed No" onChange={handleChange} required />
                </div>
                <button className="submit-button" type="submit">Submit</button>
            </form>
            {alertMessage && <div className="alert-message">{alertMessage}</div>}
            <PatientNavigation selected="patients" />
        </div>
    );
};

export default NewPatient;
