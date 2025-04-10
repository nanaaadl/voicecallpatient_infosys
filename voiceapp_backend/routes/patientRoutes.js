const express = require("express");
const router = express.Router();
const User = require("../models/User");
const PatientRequest = require("../models/patientRequests");
const Nurse = require("../models/nurses");
const mongoose = require("mongoose");

router.get("/getAllPatients", async (req, res) => {
    try {
        const patients = await User.find({}); 

        if (patients.length === 0) {
            return res.json({ status: "Success", message: "No patients found", data: [] });
        }

        res.json({ status: "Success", data: patients });
    } catch (error) {
        console.error("Error fetching all patients:", error);
        res.status(500).json({ status: "Failure", message: "Internal Server Error" });
    }
});

router.get("/getPatients", async (req, res) => {
    try {
        let { nurseID } = req.query;

        if (!nurseID) {
            return res.status(400).json({ status: "Failure", message: "Nurse ID is required" });
        }

        const patientRequests = await PatientRequest.find({ nurse: nurseID });

        if (!patientRequests || patientRequests.length === 0) {
            return res.json({ status: "Success", message: "No patient requests found", data: [] });
        }

        const patientObjectIds = patientRequests.map(req => req.patient);
        const patients = await User.find({ _id: { $in: patientObjectIds } });

        res.json({ status: "Success", data: patients });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ status: "Failure", message: "Internal Server Error" });
    }
});

router.get("/details", async (req, res) => {
    try {
        const { patientID } = req.query;
        console.log("🔍 Searching for patient with patientID:", patientID);

        if (!patientID) {
            return res.status(400).json({ status: "Failure", message: "Patient ID is required" });
        }

        const patient = await User.findOne({ patientID: Number(patientID) }); 

        if (!patient) {
            return res.status(404).json({ status: "Failure", message: "Patient not found" });
        }

        res.json({ status: "Success", data: patient });
    } catch (error) {
        console.error("❌ Error fetching patient details:", error);
        res.status(500).json({ status: "Failure", message: "Internal Server Error" });
    }
});

router.get("/requests", async (req, res) => {
    try {
        let { patientID } = req.query;

        if (!patientID) {
            return res.status(400).json({ status: "Failure", message: "Patient ID is required" });
        }

        const patientRequests = await PatientRequest.find({ patient: patientID }).populate('nurse'); // Populate nurse details

        if (!patientRequests || patientRequests.length === 0) {
            return res.json({ status: "Success", message: "No requests found", data: [] });
        }

        res.json({ status: "Success", data: { requests: patientRequests, nurses: patientRequests.map(req => req.nurse) } });

    } catch (error) {
        console.error("❌ Error fetching patient requests:", error);
        res.status(500).json({ status: "Failure", message: "Internal Server Error" });
    }
});

router.get("/nurses/:nurseID", async (req, res) => {
    try {
        let { nurseID } = req.params;

        if (!nurseID) {
            return res.status(400).json({ status: "Failure", message: "Nurse ID is required" });
        }

        const nurse = await Nurse.findById(nurseID); 

        if (!nurse) {
            return res.json({ status: "Success", message: "Nurse not found", data: null });
        }

        res.json({ status: "Success", data: nurse });
    } catch (error) {
        console.error("❌ Error fetching nurse details:", error);
        res.status(500).json({ status: "Failure", message: "Internal Server Error" });
    }
});



module.exports = router;
