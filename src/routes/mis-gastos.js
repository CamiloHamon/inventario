const express = require('express');
const router = express.Router();

const { isLoggedIn, isAdmin } = require('../helpers/auth');
const misGastos = require('../controllers/misGastosController');

router.get('/mis-gastos', isLoggedIn, isAdmin, misGastos.view);

module.exports = router;
