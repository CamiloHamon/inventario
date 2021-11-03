const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');

const { isLoggedIn, isAdmin } = require('../helpers/auth');

router.get('/clientes', isLoggedIn, isAdmin, clientController.clientView);

router.get(
	'/clientes/agregar',
	isLoggedIn,
	isAdmin,
	clientController.clientAdd
);

router.get('/clientes/list', isLoggedIn, clientController.clientList);

router.post(
	'/clientes/agregar',
	isLoggedIn,
	isAdmin,
	clientController.clientAddForm
);

router.get(
	'/clientes/:id/editar',
	isLoggedIn,
	isAdmin,
	clientController.clientEdit
);

router.post(
	'/clientes/:id/editar',
	isLoggedIn,
	isAdmin,
	clientController.clientEditForm
);

router.post(
	'/clientes/:id/eliminar',
	isLoggedIn,
	isAdmin,
	clientController.clientDelete
);

module.exports = router;
