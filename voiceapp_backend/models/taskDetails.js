const mongoose = require("mongoose");
const TaskDetailSchema = new mongoose.Schema({
    taskId: { type: Number, required: true }, 
    taskName: { type: String, required: true },
    taskStatus: { type: String, required: true },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'nurses', required: true },
});
module.exports = mongoose.model("taskDetails", TaskDetailSchema); 
