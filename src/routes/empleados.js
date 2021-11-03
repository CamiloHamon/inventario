const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');

const empController = require('../controllers/empleadosController');

const { isLoggedIn, isAdmin } = require('../helpers/auth');

router.get('/empleados', isLoggedIn, isAdmin, empController.list);

router.get('/empleados/agregar', isLoggedIn, isAdmin, empController.insertView);

router.get('/empleados/editar/:id', isLoggedIn, isAdmin, empController.edit);

router.get(
	'/empleados/:id/imgProfile',
	isLoggedIn,
	isAdmin,
	empController.imgProfile
);

router.post(
	'/empleados/editar/:id/img',
	isLoggedIn,
	isAdmin,
	multer,
	empController.updateImg
);

router.post(
	'/empleados/editar/:id/name',
	isLoggedIn,
	isAdmin,
	empController.updateName
);

router.post(
	'/empleados/editar/:id/position',
	isLoggedIn,
	isAdmin,
	empController.updatePosition
);

router.post(
	'/empleados/editar/:id/username',
	isLoggedIn,
	isAdmin,
	empController.updateUsername
);

router.post(
	'/empleados/editar/:id/password',
	isLoggedIn,
	isAdmin,
	empController.updatePass
);

router.post(
	'/empleados/agregar',
	isLoggedIn,
	multer,
	isAdmin,
	empController.insert
);

router.post(
	'/empleados/eliminar/:id',
	isLoggedIn,
	isAdmin,
	empController.delete
);

module.exports = router;
