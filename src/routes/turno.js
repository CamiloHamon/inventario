const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastosController');
const turnoController = require('../controllers/turnoController');
const cajaController = require('../controllers/cajaController');
const valesController = require('../controllers/valesController');
const pagoTController = require('../controllers/pagoTController');
const bajasController = require('../controllers/bajasController');
const venController = require('../controllers/ventasController');
const fiadosController = require('../controllers/fiadosController');

const {
	isLoggedIn,
	isAdmin,
	currentTurn,
	notTurn,
} = require('../helpers/auth');
const obsController = require('../controllers/obsController');
const reportesController = require('../controllers/reportesController');

router.get('/turno', isLoggedIn, notTurn, turnoController.turn);

router.post('/turno', isLoggedIn, notTurn, turnoController.turnForm);

router.post(
	'/turno/terminar',
	isLoggedIn,
	currentTurn,
	turnoController.terminar
);

router.post('/check-cash-box', isLoggedIn, currentTurn, turnoController.checkChashBox);

router.post('/save-cash-box', isLoggedIn, currentTurn, turnoController.saveChashBox);

router.get('/turno/caja', isLoggedIn, currentTurn, cajaController.caja);

router.get('/turno/caja/products', cajaController.products);

router.post('/turno/caja/registrar', isLoggedIn, cajaController.register);

router.get(
	'/turno/gastos',
	isLoggedIn,
	currentTurn,
	gastosController.gastosView
);

router.get(
	'/turno/gastos/agregar',
	isLoggedIn,
	currentTurn,
	gastosController.gastosInsert
);

router.post(
	'/turno/gastos/agregar',
	isLoggedIn,
	currentTurn,
	gastosController.gastosInsertForm
);

router.get(
	'/turno/gastos/:id/editar',
	isLoggedIn,
	isAdmin,
	currentTurn,
	gastosController.gastosEdit
);

router.post(
	'/turno/gastos/:id/editar',
	isLoggedIn,
	isAdmin,
	currentTurn,
	gastosController.gastosEditForm
);

router.post(
	'/turno/gastos/:id/eliminar',
	isLoggedIn,
	isAdmin,
	currentTurn,
	gastosController.gastosDelete
);

router.get('/turno/vales', isLoggedIn, currentTurn, valesController.valesView);

router.get(
	'/turno/vales/agregar',
	isLoggedIn,
	currentTurn,
	valesController.addLoan
);

router.get(
	'/turno/vales/:id/ver',
	isLoggedIn,
	currentTurn,
	valesController.valesDetails
);

router.post(
	'/turno/vales/agregar',
	isLoggedIn,
	currentTurn,
	valesController.addLoanForm
);

router.post(
	'/turno/vales/:id/eliminar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	valesController.deleteLoan
);

router.post(
	'/turno/vales/:id/eliminarAll',
	isLoggedIn,
	currentTurn,
	isAdmin,
	valesController.deleteLoanAll
);

router.get(
	'/turno/vales/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	valesController.editLoan
);

router.post(
	'/turno/vales/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	valesController.editLoanForm
);

router.post(
	'/turno/vales/delPay',
	isLoggedIn,
	currentTurn,
	isAdmin,
	valesController.delValPay
);

router.get(
	'/turno/vales/:id/list',
	isLoggedIn,
	currentTurn,
	valesController.listLoans
);

router.get(
	'/turno/bajas',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedView
);

router.get(
	'/turno/bajas/agregar',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedAdd
);

router.post(
	'/turno/bajas/agregar',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedForm
);

router.post(
	'/turno/bajas/:id/eliminar',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedDelete
);

router.get(
	'/turno/bajas/:id/editar',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedEdit
);

router.post(
	'/turno/bajas/:id/editar',
	isLoggedIn,
	currentTurn,
	bajasController.dischargedEditForm
);

router.get('/turno/pago', isLoggedIn, currentTurn, pagoTController.payView);

router.get(
	'/turno/pago/agregar',
	isLoggedIn,
	currentTurn,
	pagoTController.addPay
);

router.post(
	'/turno/pago/agregar',
	isLoggedIn,
	currentTurn,
	pagoTController.addPayForm
);

router.get(
	'/turno/pago/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	pagoTController.editPay
);

router.post(
	'/turno/pago/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	pagoTController.editPayForm
);

router.post(
	'/turno/pago/:id/eliminar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	pagoTController.deletePay
);

router.get(
	'/turno/pago/no-registrado',
	isLoggedIn,
	currentTurn,
	(req, res, next) => {
		res.render('pages/caja/turno-pagos-noRegistrado');
	}
);

router.get(
	'/turno/venta',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesView
);

router.get(
	'/turno/venta/:id/ver',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesSee
);

router.post(
	'/turno/venta/:id/deleteAll',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesDeleteAll
);

router.post(
	'/turno/venta/:id/eliminar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesDelete
);

router.get(
	'/turno/venta/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesEdit
);

router.post(
	'/turno/venta/:id/editar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	venController.salesEditForm
);

router.get('/turno/fiados', isLoggedIn, currentTurn, fiadosController.view);

router.get(
	'/turno/fiados/:id/ver',
	isLoggedIn,
	currentTurn,
	fiadosController.viewTrust
);

router.post(
	'/turno/fiados/:id/saldar',
	isLoggedIn,
	currentTurn,
	isAdmin,
	fiadosController.saldar
);

router.get(
	'/turno/fiados/:id/editar',
	isLoggedIn,
	currentTurn,
	fiadosController.trustEdit
);

router.post(
	'/turno/fiados/:id/editar',
	isLoggedIn,
	currentTurn,
	fiadosController.trustEditForm
);

router.post(
	'/turno/fiados/:id/eliminar',
	isLoggedIn,
	currentTurn,
	fiadosController.trustDelete
);

router.post(
	'/turno/fiados/:id/deleteAll',
	isLoggedIn,
	currentTurn,
	fiadosController.trustDeleteAll
);

router.get('/turno/venta/editar', isLoggedIn, currentTurn, (req, res, next) => {
	res.render('pages/caja/turno-venta-editar');
});

router.post(
	'/turno/observation/:id/delete/:type',
	isLoggedIn,
	currentTurn,
	obsController.delete
);

router.get('/pruebaFactura', reportesController.reportToDay);

module.exports = router;
