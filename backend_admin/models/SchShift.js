const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse', 
    required: true,
    index: true 
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true 
  },
  floor: {
    type: String,
    default: '' 
  },
  unit: {
    type: String,
    default: '' 
  },

}, { timestamps: true }); 

module.exports = mongoose.model('Shift', ShiftSchema);