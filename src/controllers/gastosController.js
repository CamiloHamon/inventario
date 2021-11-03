const moment = require('../middlewares/moment');
const gastosModel = require('../models/gastosModel');
const flMessage = require('../helpers/flash');
const turnHelper = require('../helpers/turn');
const helpers = require('../helpers/helpers');

const gastosController = {};

gastosController.gastosView = async (req, res, next) => {
	const view = { gastos: [], totalG: '', alert: [], error: [] };
	const date = moment.toDay();
	const gastos = await gastosModel.listBills(date);
	for (const g of gastos) g.price = helpers.decimal(g.price);

	view.gastos = gastos;

	const totalG = await gastosModel.totalG(date);

	view.totalG = helpers.decimal(totalG);

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-gastos', view);
};

gastosController.gastosInsert = async (req, res, next) => {
	const view = { products: [] };

	view.products = await getList();

	res.render('pages/caja/turno-gastos-agregar', view);
};

gastosController.gastosInsertForm = async (req, res, next) => {
	let { product, price } = req.body;

	let info = 'Registrado correctamente.',
		error = 'No se pudo registrar el gasto.',
		result = false;

	if (product && !isNaN(price)) {
		product = await insertProduct(product);
		const date = moment.toDay(),
			time = moment.currentTime(),
			idTurn = turnHelper.idTurn(req.user.idUser);

		if (product.insertId) product.idbillsDetails = product.insertId;
		let idDetails = product.idbillsDetails;

		result = await gastosModel.insertBill(price, date, time, idTurn, idDetails);
	} else error = 'Debe ingresar un precio válido.';

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/gastos');
};

gastosController.gastosEdit = async (req, res, next) => {
	const id = req.params.id;
	const view = { bill: [], products: [] };
	const date = moment.toDay();
	const bill = await gastosModel.findById(id, date);

	if (bill.length > 0) {
		view.products = await getList();
		bill[0].name = bill[0].name.toLocaleUpperCase();
		view.bill = bill[0];
	} else return res.redirect('/turno/gastos');

	res.render('pages/caja/turno-gastos-editar', view);
};

gastosController.gastosEditForm = async (req, res, next) => {
	let { product, price } = req.body;
	const id = req.params.id;

	let info = 'Gasto actualizado correctamente.',
		error = 'No se pudo actualizar el gasto.',
		result = false;

	if (product && !isNaN(price)) {
		const date = moment.toDay();
		const bill = await gastosModel.findById(id, date);

		if (bill.length > 0) {
			product = await insertProduct(product);

			if (product.insertId) product.idbillsDetails = product.insertId;
			let idDetails = product.idbillsDetails;

			result = await gastosModel.updateBill(id, idDetails, price);
		}
	} else error = 'Debe ingresar un precio válido.';

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/gastos');
};

gastosController.gastosDelete = async (req, res, next) => {
	const id = req.params.id;
	let result = false;
	const info = 'Gasto eliminado correctamente.',
		error = 'No se pudo eliminar el gasto.';

	const date = moment.toDay();
	const bill = await gastosModel.findById(id, date);

	if (bill.length > 0) {
		result = await gastosModel.deleteBill(id);
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/gastos');
};

async function getList() {
	const products = await gastosModel.list();
	for (const p of products) p.name = p.name.toLocaleUpperCase();
	return products;
}

async function insertProduct(product) {
	let result = false;
	const listProduct = await gastosModel.list();
	product = cleanSpace(product.toLowerCase());

	for (let i = 0; i < listProduct.length; i++) {
		if (listProduct[i].name.indexOf(product) !== -1) {
			product = listProduct[i];
			result = false;
			break;
		} else result = true;
	}

	if (result) {
		product = await gastosModel.insertList(product);
	}

	return product;
}

function cleanSpace(product) {
	let val = true;
	while (val) {
		if (product.charAt(product.length - 1) === ' ') {
			product = product.slice(0, product.length - 1);
		} else {
			val = false;
		}
	}
	return product;
}

module.exports = gastosController;
