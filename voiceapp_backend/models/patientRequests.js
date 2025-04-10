const mongoose = require("mongoose");
const PatientRequestSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'nurses', required: true },
    request: { type: String, required: true },
    status: { type: String, enum: ["pending", "inProgress", "completed"], default: "pending" }
}, { timestamps: true });
module.exports = mongoose.model("patientRequests", PatientRequestSchema);