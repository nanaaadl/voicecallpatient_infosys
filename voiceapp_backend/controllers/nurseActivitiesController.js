const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());

const objMessages = require('../common/messages');
const objVariables = require('../common/variables');
const PatientRequestModel = require('../models/patientRequests');
const NurseModel = require('../models/nurses');
const mongoose = require('mongoose');

const getPatientRequests = async (req, res) => {
    try {
        const { nurseId } = req.query; 
        if (!nurseId) {
            return res.status(400).json({ status: "Failure", message: "nurseId is required" });
        }

        const requests = await PatientRequestModel.find({ nurse: new mongoose.Types.ObjectId(nurseId) })
            .populate('patient'); 

        res.status(200).json({ status: "Success", data: requests.length ? requests.map(r => ({
          ...r.toObject(),
          status: r.status, 
        }))
      : [] });
    } catch (error) {
        return res.status(500).json({ status: "Failure", message: "Internal Server error", error: error.message });
    }
};


const updatePatientRequestStatus = async (req, res) => {
    try {
        const { nurseID, patientID, request, status } = req.body;
        console.log("Updating request status:", { nurseID, patientID, request, status });
        const updatedRequest = await PatientRequestModel.findOneAndUpdate(
            { nurse: nurseID, patient: patientID, request: request.trim() }, 
            { status: status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ status: "Failure", message: "Request not found or nurse not authorized" });
        }

        res.status(200).json({ status: "Success", data: updatedRequest });
    } catch (error) {
        return res.status(500).json({ status: "Failure", message: "Internal Server error", error: error.message });
    }
};

const assignNurseToRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
  
      const request = await Request.findById(requestId).populate('patient');
      if (!request || request.status !== 'Pending') {
        return res.status(400).json({ error: "Request not found or already assigned" });
      }
  
      const patient = request.patient;
      const allNurses = await Nurse.find({ shiftActive: true }); // filter by shift
  
      const sortedNurses = allNurses
        .filter(nurse => nurse.status === 'Available')
        .sort((a, b) => {
          const floorDiffA = Math.abs(a.floor - patient.floor);
          const floorDiffB = Math.abs(b.floor - patient.floor);
          return floorDiffA - floorDiffB;
        });
  
      const assignedNurse = sortedNurses[0];
      if (!assignedNurse) {
        return res.status(404).json({ message: "No available nurse found." });
      }
  
      request.assignedNurse = assignedNurse._id;
      request.status = "Assigned";
      await request.save();
  
      assignedNurse.status = "Busy";
      await assignedNurse.save();
  
      res.json({ message: "Nurse assigned successfully", assignedNurse });
    } catch (err) {
      console.error("Error assigning nurse:", err);
      res.status(500).json({ error: "Server error during nurse assignment" });
    }
  };
  const completeRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
  
      const request = await Request.findById(requestId).populate('patient assignedNurse');
      if (!request || request.status !== 'Assigned') {
        return res.status(400).json({ error: "Request not found or not assigned yet." });
      }
  
      request.status = "Fulfilled";
      await request.save();

      const nurse = request.assignedNurse;
      nurse.status = "Available";
      await nurse.save();
  
      const patient = request.patient;
      patient.condition = "Stable";
      await patient.save();
  
      res.json({ message: "Request marked as fulfilled", nurse, patient });
    } catch (err) {
      console.error("Error completing request:", err);
      res.status(500).json({ error: "Server error during request completion" });
    }
  };
   

module.exports = {
    getPatientRequests,
    assignNurseToRequest,
    updatePatientRequestStatus,
    completeRequest
};
