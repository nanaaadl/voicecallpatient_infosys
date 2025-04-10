const express = require('express');
const router = express.Router();
const { handleAutoAssignment, markRequestFulfilled } = require('../controllers/autoAssignController');
router.post('/assign', handleAutoAssignment);
router.put('/request/:id/fulfill', markRequestFulfilled);
module.exports = router;
