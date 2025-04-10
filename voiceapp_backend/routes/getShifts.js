const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift'); 

router.get('/', async (req, res) => {
  try {
    const shifts = await Shift.find().populate('nurseId', ['firstName', 'lastName']); 
    res.json(shifts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { nurseId, startTime, endTime, date, floor, unit } = req.body;

  try {
    const newShift = new Shift({
      nurseId,
      startTime,
      endTime,
      date,
      floor,
      unit
    });

    const shift = await newShift.save();
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate('nurseId', ['firstName', 'lastName']);
    if (!shift) {
      return res.status(404).json({ msg: 'Shift not found' });
    }
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Shift not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { nurseId, startTime, endTime, date, floor, unit } = req.body;

  const shiftFields = {};
  if (nurseId) shiftFields.nurseId = nurseId;
  if (startTime) shiftFields.startTime = startTime;
  if (endTime) shiftFields.endTime = endTime;
  if (date) shiftFields.date = date;
  if (floor) shiftFields.floor = floor;
  if (unit) shiftFields.unit = unit;

  try {
    let shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({ msg: 'Shift not found' });
    }

    shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { $set: shiftFields },
      { new: true }
    ).populate('nurseId', ['firstName', 'lastName']);

    res.json(shift);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Shift not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) {
      return res.status(404).json({ msg: 'Shift not found' });
    }
    res.json({ msg: 'Shift deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Shift not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.get('/nurse/:nurseId/shifts', async (req, res) => {
    try {
        const shifts = await Shift.find({ nurseId: req.params.nurseId }).populate('nurseId', ['firstName', 'lastName']);
        res.json(shifts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/date/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
        const shifts = await Shift.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate('nurseId', ['firstName', 'lastName']);
        res.json(shifts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const shifts = await Shift.find({
            date: {
                $gte: today,
                $lte: today
            },
            startTime: { $lte: now },
            endTime: { $gte: now }
        }).populate('nurseId', ['firstName', 'lastName']);
        res.json(shifts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;