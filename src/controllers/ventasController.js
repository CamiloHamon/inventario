const moment = require('../middlewares/moment');
const venModel = require('../models/venModel');
const turnHelper = require('../helpers/turn');
const helpers = require('../helpers/helpers');
const flMessage = require('../helpers/flash');
const invModel = require('../models/invModel');
const obsModel = require('../models/obsModel');
const notifyAmountProduct = require('../helpers/notifyAmountProduct');
const venController = {};

venController.salesView = async (req, res, next) => {
	const view = { sales: [], totalV: 0, observations: [], alert: [], error: [] };
	const date = moment.toDay();
	view.sales = await venModel.list(date);
	view.sales = completeInfo(view.sales);
	const totalV = await venModel.total(date);
	view.totalV = helpers.decimal(totalV);
	view.observations = await obsModel.list(date);

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-venta', view);
};

venController.salesEdit = async (req, res, next) => {
	const view = { sale: [], observations: [] };
	const id = req.params.id;
	const date = moment.toDay();
	let sale = await venModel.findById(id, date);
	const observations = await obsModel.list(date);
	if (sale.length > 0) {
		if (observations.length > 0) {
			sale = sale[0];
			view.sale = await venModel.infoSale(sale.idSales, date);
			view.sale.total = helpers.decimal(view.sale.total);
			view.observations = observations;
		} else {
			req.flash('error', 'No puede editar porque no tiene observaciones.');
			return res.redirect('/turno/venta');
		}
	} else return res.redirect('/turno/venta');

	res.render('pages/caja/turno-venta-editar', view);
};

venController.salesEditForm = async (req, res, next) => {
	const id = req.params.id;
	const { amount, obs } = req.body;
	const date = moment.toDay();

	const info = 'Venta editada correctamente.';
	let result = false,
		error = 'Error en el servidor.';
	//Validar que tenga una observacion valida
	const observation = await obsModel.findByIdDate(obs, date);
	let idProductRedirect = null;
	if (observation.length > 0) {
		//Si existe la observacion de ese dia y si esta como activa (status = 1)
		const sale = await venModel.findById(id, date); //Buscar la venta
		if (sale.length > 0) {
			idProductRedirect = sale[0].fk_idProduct;
			//Buscar el producto padre
			const prodCaseSp = await searchProduct(sale[0]);
			const idProduct = prodCaseSp.idProduct;
			if (!valInv(prodCaseSp)) {
				// validar si es un producto que se inventarea
				let prodPadre = null;
				if (prodCaseSp.status) prodPadre = prodCaseSp;
				else {
					prodPadre = await invModel.productFindById(idProduct);
					prodPadre = prodPadre[0];
				}

				//amount del producto para descontar en el inventario
				let restaAmount = sale[0].amount - amount;
				let op = true;
				if (restaAmount < 0) {
					restaAmount *= -1;
					op = false;
				}
				const amountAux = await amountProduct(
					prodCaseSp,
					prodPadre,
					restaAmount
				);
				//actualizar el amount del producto padre
				if (prodPadre.amount > amountAux && !op) {
					const auxAmount = prodPadre.amount - restaAmount;
					if(auxAmount <= prodPadre.minAmount){
						await notifyAmountProduct(prodPadre.name, auxAmount);
					}
					await invModel.subAmntProIn(prodPadre.idProduct, amountAux);
				} else {
					await invModel.sumAmntProIn(prodPadre.idProduct, amountAux);
				}
			}
			//actualizar la cantidad vendida del producto de la carta
			result = await venModel.update(sale[0].idSales, amount);
			if (result)
				result = await obsModel.update(observation[0].idObservationSales);
		} else {
			error = 'No se puede actualizar la venta porque no existe.';
		}
	} else {
		error = 'No se puede actualizar la venta porque no tiene observaciones.';
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect(`/turno/venta/${idProductRedirect}/ver`);
};

async function searchProduct(product) {
	const infoProduct = await invModel.productFindById(product.fk_idProduct);
	if (infoProduct.length > 0) {
		const idCaseSpecial = infoProduct[0].fk_idProdCaseSpecial;
		if (idCaseSpecial !== 1) {
			const prodPadre = await invModel.findByIdSpecial(idCaseSpecial);
			if (prodPadre.length > 0) return prodPadre[0];
		} else return infoProduct[0];
	}

	return false;
}

function valInv(product) {
	const amount = product.amount,
		menu = product.menu,
		idCaseSpecial = product.fk_idProdCaseSpecial;

	if (amount === null && menu === 1 && idCaseSpecial === 1) return true;

	return false;
}

async function amountProduct(prodCaseSp, prodPadre, inpAmount) {
	if (prodPadre) {
		let amount = 0;
		if (prodCaseSp.status) amount = inpAmount;
		else amount = prodCaseSp.amount * inpAmount;

		return Number(amount);
	}

	return -1;
}

venController.salesDeleteAll = async (req, res, next) => {
	const id = req.params.id;
	const date = moment.toDay();
	const sales = await venModel.findByIdPro(id, date);

	const info = 'Venta eliminada correctamente.',
		error = 'No se pudo eliminar la venta.';
	let result = false;

	if (sales.length > 0) {
		for (const s of sales) {
			const del = await turnHelper.delUpdaAmount(s.fk_idProduct, s.amount);
		}
		result = await venModel.delAll(id, date);
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/venta');
};

venController.salesDelete = async (req, res, next) => {
	const id = req.params.id;
	const idObs = req.body.obs;
	const date = moment.toDay();
	const sales = await venModel.findById(id, date);
	const obs = await obsModel.findByIdDate(idObs, date);
	const info = 'Venta eliminada correctamente.',
		error = 'No se pudo eliminar la venta.';
	let result = true;

	if (sales.length > 0 && obs.length > 0) {
		//const delSale = await venModel.delete(id, date);

		const prodCaseSp = await searchProduct(sales[0]);
		const idProduct = prodCaseSp.idProduct,
			amount = sales[0].amount;
		if (!valInv(prodCaseSp)) {
			// validar si es un producto que se inventarea
			let prodPadre = null;
			if (prodCaseSp.status) prodPadre = prodCaseSp;
			else {
				prodPadre = await invModel.productFindById(idProduct);
				prodPadre = prodPadre[0];
			}

			//amount del producto para descontar en el inventario
			const amountAux = await amountProduct(prodCaseSp, prodPadre, amount);

			//actualizar el amount del producto padre
			result = await invModel.sumAmntProIn(prodPadre.idProduct, amountAux);
		}
		if (result) {
			result = await obsModel.update(idObs);
			result = await venModel.delete(id, date);
		}
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect(`/turno/venta`);
};

venController.salesSee = async (req, res, next) => {
	const view = {
		product: [],
		sales: [],
		total: 0,
		observations: [],
		alert: [],
		error: [],
	};
	const id = req.params.id;
	const date = moment.toDay();
	const salesPro = await venModel.seeSale(id, date);

	if (salesPro.length > 0) {
		view.sales = completeInfoSales(salesPro);
		const product = await invModel.productFindById(id);
		view.product = product[0];
		const total = await venModel.totalProduct(id, date);
		view.total = helpers.decimal(total);
		view.observations = await obsModel.list(date);

		const msg = flMessage.messages(req.flash());

		if (msg) {
			msg.type === 'info'
				? (view.alert = msg.message)
				: (view.error = msg.message);
		}

		return res.render('pages/caja/turno-venta-ver', view);
	} else return res.redirect('/turno/ventas');
};

function completeInfoSales(sales) {
	for (const s of sales) {
		s.total = helpers.decimal(s.total);
		s.date = moment.date(s.date);
		s.time = moment.formatTime(s.time);
	}

	return sales;
}

function completeInfo(sales) {
	for (const s of sales) {
		s.total = helpers.decimal(s.total);
	}
	return sales;
}

module.exports = venController;
