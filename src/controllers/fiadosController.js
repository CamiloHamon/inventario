const fiadosModel = require('../models/fiadosModel');
const clientModel = require('../models/clientModel');
const moment = require('../middlewares/moment');
const helper = require('../helpers/helpers');
const flMessage = require('../helpers/flash');
const turnHelper = require('../helpers/turn');
const venModel = require('../models/venModel');
const invModel = require('../models/invModel');
const obsModel = require('../models/obsModel');

const fiadosController = {};

fiadosController.view = async (req, res, next) => {
	const view = {
		clients: [],
		alert: [],
		observations: [],
		error: [],
		total: 0,
	};

	const clients = await fiadosModel.list();
	view.clients = completeInfo(clients);
	const total = await fiadosModel.totalAll();
	view.total = helper.decimal(total);
	const msg = flMessage.messages(req.flash());
	view.observations = await obsModel.list(moment.toDay());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-fiados', view);
};

fiadosController.viewTrust = async (req, res, next) => {
	const id = req.params.id;
	const view = {
		trusts: [],
		client: [],
		total: 0,
		observations: [],
		alert: [],
		error: [],
	};

	const exist = await fiadosModel.findByIdClient(id);

	if (exist.length > 0) {
		const trusts = await fiadosModel.listTrust(id);
		if (trusts.length > 0) {
			view.trusts = completeInfo(trusts);
			const client = await clientModel.findById(id);
			view.client = client[0];
			const total = await fiadosModel.total(id);
			view.total = helper.decimal(total);
			view.observations = await obsModel.list(moment.toDay());
		} else return res.redirect('/turno/fiados');
	}

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-fiados-ver', view);
};

fiadosController.trustEdit = async (req, res, next) => {
	const id = req.params.id;
	const view = { trusts: [], client: [], total: 0, observations: [] };

	const trust = await fiadosModel.findById(id);
	const observations = await obsModel.list(moment.toDay());

	if (trust.length > 0 && observations.length > 0) {
		view.trusts = trust[0];
		const idUser = view.trusts.fk_idClient;
		const client = await clientModel.findById(idUser);
		view.client = client[0];
		const total = await fiadosModel.totalTrust(id);
		view.total = helper.decimal(total);
		view.observations = observations;
	} else return res.redirect('/turno/fiados');

	res.render('pages/caja/turno-fiados-editar', view);
};

fiadosController.trustEditForm = async (req, res, next) => {
	const id = req.params.id;
	const { obs } = req.body;
	let amount = Number(req.body.amount);
	let trust = await fiadosModel.findById(id);
	const observation = await obsModel.findByIdDate(obs, moment.toDay());

	const info = 'Fiado editada correctamente.',
		error = 'No se pudo editar el fiado. Revise su inventario.';
	let result = false;
	let idClientRedirect = null;

	if (trust.length > 0 && observation.length > 0) {
		idClientRedirect = trust[0].fk_idClient;
		const prodCaseSp = await searchProduct(trust[0]);
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
			let restaAmount = trust[0].amount - amount;
			let op = true;
			if (restaAmount < 0) {
				restaAmount *= -1;
				op = false;
			}
			const amountAux = await amountProduct(prodCaseSp, prodPadre, restaAmount);
			//actualizar el amount del producto padre

			if (prodPadre.amount > amountAux && !op) {
				console.log('Se va a sumar', amountAux);
				await invModel.subAmntProIn(prodPadre.idProduct, amountAux);
			} else {
				console.log('Se va a sumar', amountAux);
				await invModel.sumAmntProIn(prodPadre.idProduct, amountAux);
			}
		}
		//actualizar la cantidad del fiado
		result = await fiadosModel.update(id, amount);
		if (result) {
			result = await obsModel.update(obs);
		}
	}
	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect(`/turno/fiados/${idClientRedirect}/ver`);
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

fiadosController.trustDelete = async (req, res, next) => {
	const id = req.params.id;
	const { obs } = req.body;

	const info = 'Fiado eliminado correctamente.',
		error = 'No se pudo eliminar el Fiado.';
	let result = true;

	const trust = await fiadosModel.findById(id);
	const observation = await obsModel.findByIdDate(obs, moment.toDay());

	if (trust.length > 0 && observation.length > 0) {
		//const delTrust = await fiadosModel.delete(idTrust);
		if (true) {
			const amount = trust[0].amount;
			const prodCaseSp = await searchProduct(trust[0]);
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
				const amountAux = await amountProduct(prodCaseSp, prodPadre, amount);

				//actualizar el amount del producto padre
				result = await invModel.sumAmntProIn(prodPadre.idProduct, amountAux);
			}

			//await obsModel.update(obs);
			if (result) {
				result = await obsModel.update(obs);
				result = await fiadosModel.delete(id);
			}
		}
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/fiados');
};

fiadosController.trustDeleteAll = async (req, res, next) => {
	const id = req.params.id;

	const info = 'Fiado eliminado correctamente.',
		error = 'No se pudo eliminar el fiado.';
	let result = false;

	const trust = await fiadosModel.listTrust(id);

	if (trust.length > 0) {
		for (const t of trust) {
			const del = await turnHelper.delUpdaAmount(t.fk_idProduct, t.amount);
		}
		result = await fiadosModel.delAll(id);
	} else return res.redirect('/turno/fuados');

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/fiados');
};

fiadosController.saldar = async (req, res, next) => {
	const id = req.params.id;
	const { trust } = req.body;

	const info = 'Fiado saldado correctamente.',
		error = 'No se pudo saldar el fiado.';

	let val = false;

	for (let i = 0; i < trust.length; i++) {
		//validar que estos fiados correspondan al cliente en cuestion
		const fiado = await fiadosModel.findByIdClientIdTrust(trust[i], id);
		if (!fiado.length > 0) {
			val = false;
			break;
		} else val = true;
	}

	if (val) {
		const time = moment.currentTime(),
			idTurn = turnHelper.idTurn(req.user.idUser);

		for (const t of trust) {
			const trustSale = (await fiadosModel.findById(t))[0];
			const date = moment.dateMYSQL(trustSale.date); //se registra la venta el dia que se le hace el trust
			await venModel.insertSale(
				trustSale.fk_idProduct,
				idTurn,
				trustSale.amount,
				date,
				time
			);

			await fiadosModel.saldar(t, idTurn);
		}
		req.flash('info', info);
		return res.send(true);
	} else {
		req.flash('error', error);
		return res.send(false);
	}
};

function completeInfo(trust) {
	for (const t of trust) {
		t.date = moment.date(t.date);
		t.total = helper.decimal(t.total);
	}
	return trust;
}

module.exports = fiadosController;
