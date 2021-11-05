const invModel = require('../models/invModel');
const moment = require('../middlewares/moment');
const helpers = require('../helpers/helpers');
const flMessage = require('../helpers/flash');
const turnHelper = require('../helpers/turn');
const venModel = require('../models/venModel');
const fiadosModel = require('../models/fiadosModel');
const clientModel = require('../models/clientModel');
const obsModel = require('../models/obsModel');
const endTurn = require('../helpers/endTurn');
const notifyAmountProduct = require('../helpers/notifyAmountProduct');

const cajaController = {};

cajaController.caja = async (req, res, next) => {
	const view = { alert: [], error: [] };
	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	const currentTurns = JSON.parse(localStorage.getItem('turnos'));
	const date = moment.toDay();

	for (let i = 0; i < currentTurns.length; i++) {
		const dateTurn = new Date(currentTurns[i].date);
		const dateToDay = new Date(date);
		if (dateToDay > dateTurn) {
			await endTurn.end(currentTurns[i].idUser);
			return res.redirect('/turno');
		}
	}

	res.render('pages/caja/turno-caja', view);
};

cajaController.products = async (req, res, next) => {
	let menu = await invModel.listMenu();
	for (const m of menu) {
		m.price = helpers.decimal(m.price);
		m.date = moment.date(m.date);
	}
	menu = JSON.stringify(menu);
	res.send(menu);
};

cajaController.register = async (req, res, next) => {
	const { listProducts, clients, observations } = req.body;
	const idUser = req.user.idUser,
		prodReg = [],
		failProduct = [],
		date = moment.toDay(),
		time = moment.currentTime();

	let message = '';

	const validar = await valExist(listProducts); // validar que existan esos productos
	if (validar) {
		for (const l of listProducts) {
			const prodCaseSp = await searchProduct(l);
			const idProduct = prodCaseSp.idProduct;

			const regSale = {
				idProduct,
				idTurn: turnHelper.idTurn(idUser),
				amount: l.amount,
				date,
				time,
			};

			//validar si es un producto que se debe inventariar
			if (!valOnlyRegSale(prodCaseSp)) {
				let prodPadre = null;
				if (prodCaseSp.status) prodPadre = prodCaseSp;
				else {
					prodPadre = await invModel.productFindById(idProduct);
					prodPadre = prodPadre[0];
				}

				const amount = await amountProduct(prodCaseSp, prodPadre, l.amount);
				if (prodPadre.amount >= amount) {
					regSale.idProduct = l.idProduct;
					regSale.amountInv = amount;
					regSale.inv = true;
					regSale.idProdInv = idProduct;
					prodReg.push(regSale);
					if(prodPadre.amount <= prodPadre.minAmount){
						await notifyAmountProduct(prodPadre.name, prodPadre.amount);
					}
				} else {
					failProduct.push({
						name: prodPadre.name,
						currentAmount: prodPadre.amount,
						amount,
					});
				}
			} else {
				// si no se inventarea, se registra unicamente la venta
				prodReg.push(regSale);
			}
		}

		if (failProduct.length === 0) {
			let result = false,
				type = null;

			if (clients > 0) {
				result = regProdFiados(clients, prodReg);
				type = 'Fiado';
			} else {
				result = regProdOrden(prodReg);
				type = 'Orden';
			}
			if (observations && result) {
				await obsModel.insert(idUser, observations, date, time);
			}

			return res.send({ status: result, type });
		} else return res.send({ status: false, failProduct });
	} else message = 'El producto no existe';
	return res.send({ status: false, message });
};

async function regProdOrden(prodReg) {
	let result = false;
	for (const pR of prodReg) {
		result = await registerSale(pR);
		if (!result) return false;

		if (pR.inv) {
			//si es un producto que se inventarea, se debe restar al inventario el amount.
			await invModel.subAmntProIn(pR.idProdInv, pR.amountInv);
		}
	}

	return result;
}

async function regProdFiados(idClient, prodReg) {
	const client = await clientModel.findById(idClient);
	let result = false;
	if (client.length > 0) {
		for (const pR of prodReg) {
			result = await regFiados({
				idClient,
				idProduct: pR.idProduct,
				idTurn: pR.idTurn,
				amount: pR.amount,
				date: pR.date,
				time: pR.time,
			});
			if (!result) return false;
			if (pR.inv && result) {
				//si es un producto que se inventarea, se debe restar al inventario el amount.
				await invModel.subAmntProIn(pR.idProdInv, pR.amountInv);
			}
		}
	}

	return result;
}

async function regFiados(props) {
	const { idClient, idProduct, idTurn, amount, date, time } = props;

	return await fiadosModel.insertTrust(
		idClient,
		idProduct,
		idTurn,
		amount,
		date,
		time
	);
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

async function registerSale(props) {
	const { idProduct, idTurn, amount, date, time } = props;
	return await venModel.insertSale(idProduct, idTurn, amount, date, time);
}

function valOnlyRegSale(product) {
	const amount = product.amount,
		menu = product.menu,
		idCaseSpecial = product.fk_idProdCaseSpecial;

	if (amount === null && menu === 1 && idCaseSpecial === 1) return true;

	return false;
}

async function valExist(listProducts) {
	let result = false;
	const listMenu = await invModel.listMenu();

	for (let i = 0; i < listProducts.length; i++) {
		for (let j = 0; j < listMenu.length; j++) {
			const lPIdProduct = listProducts[i].idProduct,
				lMIdProduct = listMenu[j].idProduct;

			if (lPIdProduct === lMIdProduct) {
				result = true;
				break;
			} else result = false;
		}

		if (!result) break;
	}

	return result;
}

async function searchProduct(product) {
	const infoProduct = await invModel.productFindById(product.idProduct);
	if (infoProduct.length > 0) {
		const idCaseSpecial = infoProduct[0].fk_idProdCaseSpecial;
		if (idCaseSpecial !== 1) {
			const prodPadre = await invModel.findByIdSpecial(idCaseSpecial);
			if (prodPadre.length > 0) return prodPadre[0];
		} else return infoProduct[0];
	}

	return false;
}

/**
 * const listMenu = await invModel.listMenu();
	let insert = false,
		productInsert = [],
		failProduct = [];

	for (let l = 0; l < listProducts.length; l++) {
		for (let m = 0; m < listMenu.length; m++) {
			if (listProducts[l].idProduct === listMenu[m].idProduct) {
				const product = await turnHelper.casesSpecials(
					listMenu[m].idProduct,
					listProducts[l].amount
				);

				for (let i = 0; i < product.length; i++) {
					let infoProduct = await invModel.productFindById(product[i].cod);
					infoProduct = infoProduct[0];
					if (infoProduct.amount === null) {
						productInsert.push({
							cod: listProducts[l].idProduct,
							amount: product[i].amount,
							inv: false,
						});
						insert = true;
					} else {
						if (infoProduct.amount >= product[i].amount) {
							productInsert.push({
								cod: listProducts[l].idProduct,
								amount: listProducts[l].amount,
								amountTotal: product[i].amount,
								inv: true,
								idProduct: product[i].cod,
							});
							insert = true;
						} else {
							failProduct.push({
								idProduct: infoProduct.idProduct,
								name: infoProduct.name,
								currentAmount: infoProduct.amount,
								amount: product[i].amount,
							});
							insert = false;
							break;
						}
					}
				}
				if (!insert) l = listProducts.length;
				m = listMenu.length;
			}
		}
	}

	if (insert) {
		const idTurn = turnHelper.idTurn(req.user.idUser);
		const date = moment.toDay(),
			time = moment.currentTime();

		let result = false;

		for (const inPro of productInsert) {
			if (inPro.inv)
				await invModel.subAmntProIn(inPro.idProduct, inPro.amountTotal);
			if (observations)
				await obsModel.insert(req.user.idUser, observations, date, time);
			if (clients > 0) {
				let client = await clientModel.findById(clients);
				if (client.length > 0) {
					client = client[0];
					if (client.idClient === clients) {
						result = await fiadosModel.insertTrust(
							clients,
							inPro.cod,
							idTurn,
							inPro.amount,
							date,
							time
						);
					}
				}
			} else {
				result = await venModel.insertSale(
					inPro.cod,
					idTurn,
					inPro.amount,
					date,
					time
				);
			}
		}
		return res.send({ status: result });
	} else {
		return res.send({ status: false, failProduct });
	}
 */

module.exports = cajaController;
