const express = require('express');
const router = express.Router();

const { isLoggedIn, isAdmin } = require('../helpers/auth');
const invController = require('../controllers/inventarioController');

router.get('/inventario', isLoggedIn, isAdmin, invController.view);

router.get(
	'/inventario/entradas',
	isLoggedIn,
	isAdmin,
	invController.listInputs
);

router.get(
	'/inventario/listProducts',
	isLoggedIn,
	isAdmin,
	invController.listProducts
);

router.get(
	'/inventario/listEntradas',
	isLoggedIn,
	isAdmin,
	invController.listEntradas
);

router.get(
	'/inventario/entradas/:id/editar',
	isLoggedIn,
	isAdmin,
	invController.inputEdit
); // Vista de la entrada a editar

router.post(
	'/inventario/entradas/:id/editar',
	isLoggedIn,
	isAdmin,
	invController.inputEditForm
); // Editar entrada enviando peticion al servidor mediante un form

router.post(
	'/inventario/entradas/:id/eliminar',
	isLoggedIn,
	isAdmin,
	invController.deleteInput
);

router.get(
	'/inventario/agregar/entrada',
	isLoggedIn,
	isAdmin,
	invController.addInput
);

router.post(
	'/inventario/agregar/entrada',
	isLoggedIn,
	isAdmin,
	invController.addInputForm
);

router.get(
	'/inventario/crear/producto',
	isLoggedIn,
	isAdmin,
	invController.createProduct
);

router.post(
	'/inventario/crear/producto',
	isLoggedIn,
	isAdmin,
	invController.createProductForm
);

router.get('/inventario/carta', isLoggedIn, isAdmin, invController.carta);

router.get(
	'/inventario/productos/nombres',
	isLoggedIn,
	isAdmin,
	invController.listNames
);

router.get(
	'/inventario/carta/list',
	isLoggedIn,
	isAdmin,
	invController.listProductMenu
);

router.get(
	'/inventario/editar/:id/producto',
	isLoggedIn,
	isAdmin,
	invController.editProduct
);

router.post(
	'/inventario/editar/:id/producto',
	isLoggedIn,
	isAdmin,
	invController.editProductForm
);

router.get(
	'/inventario/editar/:id/producto-menu',
	isLoggedIn,
	isAdmin,
	invController.editProductMenu
);

router.post(
	'/inventario/editar/:id/producto/menu',
	isLoggedIn,
	isAdmin,
	invController.editProductMenuForm
);

module.exports = router;
