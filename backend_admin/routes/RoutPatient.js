
const express = require('express');
const router = express.Router();
const Patient = require('../models/SchPatient');

async function generateUniquePatientID() {
    const firstId = 10000000; 
    const lastPatient = await Patient.findOne({}, {}, { sort: { 'patientID' : -1 } });
    if (lastPatient && lastPatient.patientID >= firstId) {
        return lastPatient.patientID + 1;
    }
    return firstId; 
}

router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ lastName: 1, firstName: 1 }); 
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const { firstName, lastName, dob, gender, contactNumber,email, address, medicalHistory, currentMedications, allergies,condition, assignedNurse, roomNumber, bedNumber } = req.body;

    try {
        const patientID = await generateUniquePatientID();
        const newPatient = new Patient({
            patientId: patientID,
            firstName,
            lastName,
            dob,
            contactNumber,
            email,
            address,
            gender,
            medicalHistory,
            condition,
            currentMedications,
            allergies,
            assignedNurse,
            roomNumber,
            bedNumber,
            patientID
        });

        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    const { firstName, lastName, dob, contactNumber, address,email, gender, medicalHistory, currentMedications, allergies,condition, assignedNurse, roomNumber, bedNumber,patientID} = req.body;

    const patientFields = {};
    if (firstName) patientFields.firstName = firstName;
    if (lastName) patientFields.lastName = lastName;
    if (dob) patientFields.dob = dob;
    if (contactNumber) patientFields.contactNumber = contactNumber;
    if (email) patientFields.email = email;
    if (address) patientFields.address = address;
    if (gender) patientFields.gender = gender;
    if (medicalHistory) patientFields.medicalHistory = medicalHistory;
    if (currentMedications) patientFields.currentMedications = currentMedications;
    if (allergies) patientFields.allergies =allergies;
    if (condition) patientFields.condition = condition;
    if (assignedNurse) patientFields.assignedNurse = assignedNurse; 
    if (roomNumber) patientFields.roomNumber = roomNumber;
    if (bedNumber) patientFields.bedNumber - bedNumber;
    if (patientID) patientFields.patientID = patientID;

    try {
        let patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: patientFields },
            { new: true }
        );

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        res.json({ msg: 'Patient deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
