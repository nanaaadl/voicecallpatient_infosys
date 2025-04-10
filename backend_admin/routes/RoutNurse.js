
const express = require('express');
const router = express.Router();
const Nurse = require('../models/SchNurse');


router.get('/', async (req, res) => {
    try {
        const nurses = await Nurse.find().sort({ lastName: 1, firstName: 1 }); 
        res.json(nurses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/', async (req, res) => {
    const { firstName, lastName, department, role, contactNumber, email, licenseNumber,username,password } = req.body;

    try {
        const newNurse = new Nurse({
            firstName,
            lastName,
            department,
            role,
            contactNumber,
            email,
            licenseNumber,
            username,
            password
        });

        const nurse = await newNurse.save();
        res.json(nurse);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'License number already exists' });
        }
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const nurse = await Nurse.findById(req.params.id);

        if (!nurse) {
            return res.status(404).json({ msg: 'Nurse not found' });
        }

        res.json(nurse);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Nurse not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.get('/byUsername', async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ msg: 'Username is required' });
    }

    try {
        const nurse = await Nurse.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });

        if (!nurse) {
            return res.status(404).json({ msg: 'Nurse not found with that username' });
        }

        res.json(nurse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    const { firstName, lastName, department, role, contactNumber,email, licenseNumber,username } = req.body;

    const nurseFields = {};
    if (firstName) patientFields.firstName = firstName;
    if (lastName) patientFields.lastName = lastName;
    if (department) nurseFields.department = department;
    if (role) nurseFields.role = role;
    if (contactNumber) nurseFields.contactNumber = contactNumber;
    if (licenseNumber) nurseFields.licenseNumber = licenseNumber;
    if (email) nurseFields.email = email;
    if (username) nurseFields.username =username;

    try {
        let nurse = await Nurse.findById(req.params.id);

        if (!nurse) {
            return res.status(404).json({ msg: 'Nurse not found' });
        }

        nurse = await Nurse.findByIdAndUpdate(
            req.params.id,
            { $set: nurseFields },
            { new: true }
        );

        res.json(nurse);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Nurse not found' });
        }
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'License number already exists' });
        }
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const nurse = await Nurse.findByIdAndDelete(req.params.id);

        if (!nurse) {
            return res.status(404).json({ msg: 'Nurse not found' });
        }

        res.json({ msg: 'Nurse deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Nurse not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;