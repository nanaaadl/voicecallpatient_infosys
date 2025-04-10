const mongoose = require("mongoose");
const PatientDetailSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    patientName: { type: String, required: true }, 
    gender: { type: String },
    disease: { type: String },
    remarks: { type: String },
    roomNo: { type: String },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'nurses' }, // Nurse assigned (optional)
});
module.exports = mongoose.model("patientDetails", PatientDetailSchema);
