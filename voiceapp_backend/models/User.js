const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  requests: [{ text: String, time: String }],
  description:{type: String},
  room:{type: String},
  phone:{type: String},
  sex:{type: String},
  patientID: { type: Number, unique: true, index: true }
});
module.exports = mongoose.model("User", UserSchema);
