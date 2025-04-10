const objVariables = require('../common/variables');
const objMessages = require('../common/messages');
const objPatientRequest = require("../models/patientRequests");
const Nurse = require("../models/nurses");
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    const nurse = JSON.parse(localStorage.getItem('nurse'));
    if (nurse?.token) {
      req.headers.Authorization = `Bearer ${nurse.token}`;
    }
    return req;
  });

const serCreatePatientRequest = async (patientID, nurseID, request, reqstatus, res) => {
    try {
        if (!patientID || !nurseID || !request || !reqstatus) {
            return res.status(400).json({
                status: objMessages.Failure,
                message: "All fields (patientID, nurseID, request, reqstatus) are required."
            });
        }

        const newRequest = new objPatientRequest({ patientID, nurseID, request, reqstatus });
        await newRequest.save();

        return res.status(objVariables.CreatedSuccessCode).json({
            status: objMessages.Success,
            message: objMessages.PatientRequestCreatedSucessfully
        });
    } catch (error) {
        console.error("Error creating patient request:", error.message);
        return res.status(objVariables.ServerErrorCode).json({
            status: objMessages.Failure,
            message: objMessages.SomethingWentWrong,
            error: error.message
        });
    }
};

const serUpdatePatientRequestStatus = async (requestId, reqstatus, intNurseID, res) => {
    try {
        if (!requestId || !reqstatus) {
            return res.status(400).json({
                status: objMessages.Failure,
                message: "Request ID and status are required."
            });
        }

        const updatedRequest = await objPatientRequest.findByIdAndUpdate(
            requestId,
            { reqstatus },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                status: objMessages.Failure,
                message: "Patient request not found."
            });
        }

        return res.status(objVariables.SuccessCode).json({
            status: objMessages.Success,
            message: objMessages.PatientRequestUpdatedSuccessfully,
            data: updatedRequest
        });
    } catch (error) {
        console.error("Error updating patient request status:", error.message);
        return res.status(objVariables.ServerErrorCode).json({
            status: objMessages.Failure,
            message: objMessages.SomethingWentWrong,
            error: error.message
        });
    }
};

const serGetPatientRequests = async (nurseId, res) => { 
    try {
        if (!nurseId) {
            return res.status(400).json({
                status: objMessages.Failure,
                message: "Nurse ID is required."
            });
        }

        const requests = await objPatientRequest.find({ nurse: nurseId }).populate('patient');

        return res.status(objVariables.SuccessCode).json({
            status: objMessages.Success,
            data: requests
        });
    } catch (error) {
        console.error("Error fetching patient requests:", error.message);
        return res.status(objVariables.ServerErrorCode).json({
            status: objMessages.Failure,
            message: objMessages.SomethingWentWrong,
            error: error.message
        });
    }
};

const getAssignedRequests = async () => {
    const response = await API.get('/nurse/assigned-requests');
    return response.data;
  };
  
  
   const markTaskComplete = async (requestId) => {
    const response = await API.post(`/nurse/complete-request`, { requestId });
    return response.data;
  };
  
  
   const getNurseProfile = async () => {
    const response = await API.get('/user/nurseprofile');
    return response.data;
  };

async function getNurseIdFromUsername(username, res) {
    try {
        if (!username) {
            res.status(400).json({ status: objMessages.Failure, message: "Username is required." });
            return null;  
        }

        const nurse = await Nurse.findOne({ username });
        if (!nurse) {
            res.status(404).json({ status: objMessages.Failure, message: "Nurse not found." });
            return null;
        }

        res.status(objVariables.SuccessCode).json({
            status: objMessages.Success,
            nurseID: nurse.nurseID
        });

        return nurse.nurseID;  
    } catch (error) {
        console.error("Error fetching nurse ID:", error.message);
        res.status(objVariables.ServerErrorCode).json({
            status: objMessages.Failure,
            message: objMessages.SomethingWentWrong,
            error: error.message
        });

        return null;  
    }
};


module.exports = {
    serCreatePatientRequest,
    serUpdatePatientRequestStatus,
    serGetPatientRequests,
    getNurseIdFromUsername,
    getAssignedRequests,
    markTaskComplete,
    getNurseProfile

};
