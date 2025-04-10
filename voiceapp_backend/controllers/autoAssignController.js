const Patient = require('../models/User');
const Nurse = require('../models/nurses');
const Shift = require('../models/nurseShifts');
const Request = require('../models/Request');

const handleAutoAssignment = async (req, res) => {
  try {
    const { patientId, reason } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const patientFloor = patient.floor;
    const condition = patient.condition;

    const nurses = await Nurse.find({ unit: patient.unit }); 

    const onShiftNurses = await Shift.find({ day: new Date().getDay() }).distinct('nurseId');
    const availableNurses = nurses.filter(n => onShiftNurses.includes(n._id.toString()));

    if (availableNurses.length === 0) {
      return res.status(400).json({ msg: 'No available nurses found' });
    }

    const chosenNurse = availableNurses[0]; 

    const newRequest = new Request({
      patientId,
      nurseId: chosenNurse._id,
      reason,
      status: 'active',
      condition,
      assignedAt: new Date()
    });

    await newRequest.save();

    return res.status(200).json({
      msg: `Assigned Nurse ${chosenNurse.name} to Patient ${patient.name}`,
      requestId: newRequest._id
    });
  } catch (error) {
    console.error('Auto assignment failed:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const markRequestFulfilled = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = 'fulfilled';
    await request.save();

    await Patient.findByIdAndUpdate(request.patientId, { condition: 'stable' });

    return res.status(200).json({ msg: 'Request marked fulfilled and patient condition updated' });
  } catch (error) {
    console.error('Fulfill error:', error);
    res.status(500).json({ msg: 'Error fulfilling request' });
  }
};

module.exports = { handleAutoAssignment, markRequestFulfilled };
