const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


const loginUser = async (req, res) => {
    const { name, dob, patientID } = req.body;

    if (!patientID) {
        return res.status(400).send({ message: "Patient ID is required for login." });
    }

    try {
        const user = await User.findOne({ name, dob, patientID: Number(patientID) });

        if (!user) {
            return res.status(404).send({ message: "User not found with provided credentials." });
        }

        const tokenPayload = {
            userId: user._id,
            patientId: user.patientID
        };
        const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || 'default_secret', { expiresIn: '1h' });

        res.status(200).send({ message: "User logged in successfully", token, patient: user });

    } catch (error) {
        console.error("Patient login error:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};
module.exports = { loginUser };
