const express = require("express");
const router = express.Router();
const Nurse = require("../models/nurses");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs'); 
const axios =require("axios");

app.use(express.json());

const userService = require('../services/userServices');
const objVariables = require('../common/variables');
const objMessages = require('../common/messages');

const ADMIN_BACKEND_BASE_URL = 'YOUR_ADMIN_BACKEND_BASE_URL/api/admin'; 

const createNewUser = async (req, res) => {
    try {
        const user = await userService.serCreateNewUser(req.body, res);
        return res;
    } catch (error) {
        return res.status(objVariables.ServerErrorCode).json({ status: objMessages.Failure, message: objMessages.InternalServerError, error: error.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        let { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const lowerUsername = username.trim().toLowerCase();
        const lowerPassword = password.trim();

        const nurse = await Nurse.findOne({ username: { $regex: new RegExp(`^${lowerUsername}$`, "i") } });

        if (!nurse) {
            console.log(`❌ Login failed: Nurse "${username}" not found.`);
            return res.status(404).json({ message: "Nurse not found" });
        }

        const isMatch = await nurse.comparePassword(password);

        if (!isMatch) {
            console.log(`❌ Login failed: Incorrect password for "${username}".`);
            return res.status(401).json({ message: "Incorrect password" });
        }

        console.log(`✅ Login successful: ${nurse.username}`);

        const token = jwt.sign({ id: nurse._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

        try {
            const nurseProfileResponse = await axios.get(`${ADMIN_BACKEND_BASE_URL}/nurses?username=${lowerUsername}`);
            const adminNurseData = nurseProfileResponse.data[0];

            if (adminNurseData && adminNurseData._id) {
                const adminNurseId = adminNurseData._id;

                
                try {
                    const shiftsResponse = await axios.get(`${ADMIN_BACKEND_BASE_URL}/shifts/nurse/${adminNurseId}/shifts`);
                    const shifts = shiftsResponse.data;

                    return res.status(200).json({ message: "Login successful", token, user: nurse, shifts });

                } catch (error) {
                    console.error('Error fetching nurse shifts from admin:', error.response?.data || error.message);
                    return res.status(200).json({ message: "Login successful, but error fetching shifts.", token, user: nurse });
                }
            } else {
                console.error('Could not retrieve admin nurse ID.');
                return res.status(200).json({ message: "Login successful, but could not retrieve complete nurse information.", token, user: nurse });
            }

        } catch (error) {
            console.error('Error fetching nurse profile from admin:', error.response?.data || error.message);
            return res.status(200).json({ message: "Login successful, but error fetching additional nurse information.", token, user: nurse });
        }

    } catch (error) {
        console.error("❌ Error in verifyUser:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: objMessages.Failure, message: objMessages.TokenIsMandatory });
        }
        const nurseIdFromToken = await userService.serGetNurseIdFromToken(token);

        const nurseProfile = await Nurse.findById(nurseIdFromToken);
        if (!nurseProfile) {
            return res.status(404).json({ status: objMessages.Failure, message: "Nurse profile not found" });
        }
        return res.json(nurseProfile);
    } catch (error) {
        console.log(objMessages.ErrorFetchingUserProfile, error.message);
        return res.status(objVariables.ServerErrorCode).json({ status: objMessages.Failure, message: objMessages.InternalServerError, error: error.message });
    }
};

module.exports = {
    createNewUser,
    verifyUser,
    getUserProfile,
};