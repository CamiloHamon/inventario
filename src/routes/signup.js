const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.get('/register', authController.renderSignup);

router.post('/register', authController.signup);

module.exports = router;