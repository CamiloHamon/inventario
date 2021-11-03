const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');

const { isLoggedIn, isAdmin } = require('../helpers/auth');
const userController = require('../controllers/userController');

router.get('/cuenta', isLoggedIn, isAdmin, userController.view);

router.get('/cuenta/listName', isLoggedIn, isAdmin, userController.showName);

router.post(
	'/cuenta/actualizar/:id/img',
	isLoggedIn,
	multer,
	isAdmin,
	userController.updateImg
);

router.post(
	'/cuenta/actualizar/:id/name',
	isLoggedIn,
	isAdmin,
	userController.updateName
);

router.post(
	'/cuenta/actualizar/:id/password',
	isLoggedIn,
	isAdmin,
	userController.updatePass
);

module.exports = router;
