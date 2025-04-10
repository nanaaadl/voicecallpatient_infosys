const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/request/recent', async (req, res) => {
  try {
    const recentRequests = await db.collection('requests')
      .find({ status: 'Fulfilled' })
      .sort({ fulfilledAt: -1 })
      .limit(10)
      .toArray();

    const detailedRequests = await Promise.all(
      recentRequests.map(async (req) => {
        const patient = await db.collection('patients').findOne({ _id: req.patientId });
        const nurse = await db.collection('nurses').findOne({ _id: req.nurseId });
        return {
          patientName: patient?.name || 'Unknown',
          nurseName: nurse?.name || 'Unknown',
          room: patient?.room || 'N/A',
          fulfilledAt: req.fulfilledAt
        };
      })
    );

    res.status(200).json(detailedRequests);
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/request/stats', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 

    const stats = await db.collection('requests').aggregate([
      {
        $match: {
          status: 'Fulfilled',
          fulfilledAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$fulfilledAt" },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = {};
    dayMap.forEach(day => result[day] = 0);
    stats.forEach(stat => {
      const day = dayMap[stat._id - 1];
      result[day] = stat.count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
