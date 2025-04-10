const mongoose = require("mongoose");
const NurseShiftSchema = new mongoose.Schema({
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'nurses', required: true },
    date: { type: String, required: true },
    shiftType: { type: String, required: true },
    nurseName: { type: String } 
});
module.exports = mongoose.model("nurseShifts", NurseShiftSchema);

