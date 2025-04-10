const mongoose = require('mongoose');

const generateCustomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const PatientSchema = new mongoose.Schema({
    customId: { type: String, default: generateCustomId, unique: true },
    patientId: { 
        type: Number,
        unique: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    contactNumber: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    medicalHistory: {
        type: String
    },
    currentMedications: {
        type: String
    },
    allergies: {
        type: String
    },
    condition: {
        type: String,
        enum: ['Stable', 'Critical', 'Serious', 'Improving', 'Worsening', 'Discharged'],
        default: 'Stable'
    },
    assignedNurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse' 
    },
    roomNumber: {
        type: String
    },
    bedNumber: {
        type: String
    },
    admittedDate: {
        type: Date,
        default: Date.now
    },
    patientID: { 
        type: Number,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);