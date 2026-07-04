const express = require('express');
const { summary } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, summary);

module.exports = router;
