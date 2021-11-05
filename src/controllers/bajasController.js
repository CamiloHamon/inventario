const moment = require('../middlewares/moment');
const bajasModel = require('../models/bajasModel');
const helpers = require('../helpers/helpers');
const invModel = require('../models/invModel');
const flMessage = require('../helpers/flash');
const turnHelper = require('../helpers/turn');
const notifyAmountProduct = require('../helpers/notifyAmountProduct');

const bajasController = {};

bajasController.dischargedView = async (req, res, next) => {
	const view = { discharged: [], alert: [], error: [] };
	const date = moment.toDay();
	const discharged = await bajasModel.listDischarged(date);
	for (const d of discharged) d.price = helpers.decimal(d.price);

	view.discharged = discharged;

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-bajas', view);
};

bajasController.dischargedAdd = async (req, res, next) => {
	const view = { products: [], obs: [] };
	view.obs = await getList();
	view.products = await invModel.listMenuDis();
	res.render('pages/caja/turno-bajas-agregar', view);
};

async function getList() {
	const products = await bajasModel.list();
	for (const p of products) p.name = p.name.toLocaleUpperCase();
	return products;
}

bajasController.dischargedForm = async (req, res, next) => {
	let { product, observation, amount } = req.body;

	let info = 'Baja registrada correctamente.',
		error = 'No se pudo registrar la baja.',
		result = false;

	product = Number(product);
	amount = Number(amount);

	if (!isNaN(product) && observation && !isNaN(amount)) {
		const idUser = req.user.idUser,
			prodReg = [],
			failProduct = [],
			date = moment.toDay(),
			time = moment.currentTime();

		const exist = await valExist(product);

		if (exist) {
			const infoProduct = (await invModel.productFindById(product))[0]; //informacion del producto que se va a descartar
			const prodCaseSp = await searchProduct(infoProduct); // si tiene un producto padre, es a el al que se le descarta en el inventario
			const idProduct = prodCaseSp.idProduct; //id del producto que se va a descartar

			const discharged = await insertDetails(observation);

			const regDischarged = {
				idProduct,
				idTurn: turnHelper.idTurn(idUser),
				amount, // amount que equivale a cuanto se le descuenta del producto padre
				date,
				time,
				idDis: discharged.iddischargedDetails || discharged.insertId,
			};

			let prodPadre = null;
			if (prodCaseSp.status) {
				//si van a descartar un producto padre, entonces se descarta a el mismo
				prodPadre = prodCaseSp;
			} else {
				prodPadre = await invModel.productFindById(idProduct); // se busca el producto padre a quien se le va hacer la baja
				prodPadre = prodPadre[0];
			}

			const calcAmount = await amountProduct(prodCaseSp, prodPadre, amount); // se calcula el amount que se debe descartar del producto principal o padre
			if (prodPadre.amount >= calcAmount) {
				// cuando se vaya a descartar, el producto padre debe de tener mayor o igual existencias a los que se le va a dar de baja
				regDischarged.idProduct = infoProduct.idProduct;
				regDischarged.amountInv = calcAmount; // valor que se le va a descontar al producto padre
				regDischarged.inv = true;
				regDischarged.idProdInv = idProduct; // id del producto padre
				prodReg.push(regDischarged);

				const auxAmount = prodPadre.amount - regDischarged.amount;
				if(auxAmount <= prodPadre.minAmount){
					await notifyAmountProduct(prodPadre.name, auxAmount);
				}
			} else {
				// si no tiene capacidad, se almacena para informar al usuario
				failProduct.push({
					name: prodPadre.name,
					currentAmount: prodPadre.amount,
					calcAmount,
				});
				error = `No hay la cantidad suficiente para descartar el producto: ${prodCaseSp.name}.`;
			}

			if (failProduct.length === 0) {
				// si no hubo problemas
				result = regProdDischarged(prodReg);
			}
		} else error = 'El producto no existe.';
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/bajas');
};

bajasController.dischargedDelete = async (req, res, next) => {
	const id = req.params.id;
	const date = moment.toDay(),
		prodReg = [];

	let info = 'Baja eliminada correctamente.',
		error = 'No se pudo eliminar la baja.',
		result = false;

	let discharged = await bajasModel.findById(id, date);
	if (discharged.length > 0) {
		discharged = discharged[0];
		const idD = discharged.idDischarged,
			idP = discharged.fk_idProduct;

		const infoProduct = (await invModel.productFindById(idP))[0]; //informacion del producto que se va a descartar
		const prodCaseSp = await searchProduct(infoProduct); // si tiene un producto padre, es a el al que se le descarta en el inventario
		const idProduct = prodCaseSp.idProduct; //id del producto que se va a descartar

		let prodPadre = null; //esto siempre se hace, una funcion
		if (prodCaseSp.status) {
			//si van a descartar un producto padre, entonces se descarta a el mismo
			prodPadre = prodCaseSp;
		} else {
			prodPadre = await invModel.productFindById(idProduct); // se busca el producto padre a quien se le va hacer la baja
			prodPadre = prodPadre[0];
		}

		const amount = discharged.amount;

		const calcAmount = await amountProduct(prodCaseSp, prodPadre, amount); // se calcula el amount que se debe descartar del producto principal o padre

		const updateDischarged = {
			idProduct: infoProduct.idProduct,
			amountInv: calcAmount, // valor que se le va a descontar al producto padre
			inv: true,
			idProdInv: idProduct, // id del producto padre
		};
		prodReg.push(updateDischarged);

		await bajasModel.delete(idD);
		result = regProdDischargedSum(prodReg);
	} else error = 'La baja que intenta borrar no existe.';

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/bajas');
};

bajasController.dischargedEdit = async (req, res, next) => {
	const view = { discharged: [], obs: [] };
	const id = req.params.id;

	const date = moment.toDay();
	const discharged = await bajasModel.findById(id, date);

	if (discharged.length > 0) {
		view.obs = await getList();
		view.discharged = await bajasModel.discharged(id, date);
	} else return res.redirect('/turno/bajas');

	res.render('pages/caja/turno-bajas-editar', view);
};

bajasController.dischargedEditForm = async (req, res, next) => {
	const id = req.params.id;
	let { observation, amount } = req.body;

	let info = 'Baja editada correctamente.',
		error = 'No se pudo editar la baja.',
		result = false;

	const date = moment.toDay(),
		prodReg = [],
		failProduct = [];
	let discharged = await bajasModel.findById(id, date);

	if (discharged.length > 0) {
		discharged = discharged[0];
		amount = Number(amount);
		if (observation && !isNaN(amount) && amount > 0) {
			const product = discharged.fk_idProduct;
			const exist = await valExist(product);
			if (exist) {
				const idUser = req.user.idUser,
					time = moment.currentTime();
				const infoProduct = (await invModel.productFindById(product))[0]; //informacion del producto que se va a descartar
				const prodCaseSp = await searchProduct(infoProduct); // si tiene un producto padre, es a el al que se le descarta en el inventario
				const idProduct = prodCaseSp.idProduct; //id del producto que se va a descartar
				const infoDis = await insertDetails(observation);

				const updateDischarged = {
					idDischarged: Number(id),
					idProduct,
					idTurn: turnHelper.idTurn(idUser),
					amount: prodCaseSp.amount, // amount que equivale a cuanto se le descuenta del producto padre
					date,
					time,
					idDis: infoDis.iddischargedDetails,
				};

				let prodPadre = null;
				if (prodCaseSp.status) {
					//si van a descartar un producto padre, entonces se descarta a el mismo
					prodPadre = prodCaseSp;
				} else {
					prodPadre = await invModel.productFindById(idProduct); // se busca el producto padre a quien se le va hacer la baja
					prodPadre = prodPadre[0];
				}

				let amtFin = discharged.amount - amount;

				let op = false; //false resta
				if (amtFin >= 0) op = true;
				else amtFin *= -1;

				const calcAmount = await amountProduct(prodCaseSp, prodPadre, amtFin); // se calcula el amount que se debe descartar del producto principal o padre
				if (prodPadre.amount >= calcAmount || op) {
					// cuando se vaya a descartar, el producto padre debe de tener mayor o igual existencias a los que se le va a dar de baja
					updateDischarged.idProduct = infoProduct.idProduct;
					updateDischarged.amountInv = calcAmount; // valor que se le va a descontar al producto padre
					updateDischarged.inv = true;
					updateDischarged.idProdInv = idProduct; // id del producto padre
					prodReg.push(updateDischarged);
				} else {
					// si no tiene capacidad, se almacena para informar al usuario
					failProduct.push({ status: false });
					error = `No hay cantidad suficiente para descartar el producto: ${prodCaseSp.name}.`;
				}

				if (failProduct.length === 0) {
					await bajasModel.update(id, amount, infoDis.iddischargedDetails);

					if (!op) result = regProdDischargedSub(prodReg);
					else result = regProdDischargedSum(prodReg);
				}
			}
		} else {
			error =
				'La cantidad debe ser mayor a cero y la observación no debe ir vacía.';
		}
	} else error = 'La baja que intenta modificar no existe.';

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno/bajas');
};

function cleanSpace(discharged) {
	let val = true;
	while (val) {
		if (discharged.charAt(discharged.length - 1) === ' ') {
			discharged = discharged.slice(0, discharged.length - 1);
		} else {
			val = false;
		}
	}
	return discharged;
}

async function regProdDischarged(prodReg) {
	let result = false;
	for (const pR of prodReg) {
		result = await registerDischarged(pR);

		if (!result) return false;

		if (pR.inv) {
			//si es un producto que se inventarea, se debe restar al inventario el amount.;
			const algo = await invModel.subAmntProIn(pR.idProdInv, pR.amountInv);
		}
	}

	return result;
}

async function regProdDischargedSub(prodReg) {
	let result = false;
	for (const pR of prodReg) {
		if (pR.inv) {
			//si es un producto que se inventarea, se debe restar al inventario el amount.;
			result = await invModel.subAmntProIn(pR.idProdInv, pR.amountInv);
		}
	}

	return result;
}

async function regProdDischargedSum(prodReg) {
	let result = false;
	for (const pR of prodReg) {
		if (pR.inv) {
			//si es un producto que se inventarea, se debe restar al inventario el amount.;
			const algo = await invModel.sumAmntProIn(pR.idProdInv, pR.amountInv);
		}
	}

	return result;
}

async function insertDetails(discharged) {
	let result = false;
	const listDischarged = await bajasModel.list();
	discharged = cleanSpace(discharged.toLowerCase());

	for (let i = 0; i < listDischarged.length; i++) {
		if (listDischarged[i].name.indexOf(discharged) !== -1) {
			discharged = listDischarged[i];
			result = false;
			break;
		} else result = true;
	}

	if (result) {
		discharged = await bajasModel.insertList(discharged);
	}

	return discharged;
}

async function registerDischarged(props) {
	const { idProduct, idTurn, amount, date, time, idDis } = props;

	return await bajasModel.insertBaja(
		idProduct,
		idTurn,
		idDis,
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

async function valExist(idProduct) {
	let result = false;
	const listMenu = await invModel.listMenuDisIds();

	for (let j = 0; j < listMenu.length; j++) {
		const lMIdProduct = listMenu[j].idProduct;
		if (idProduct === lMIdProduct) {
			result = true;
			break;
		}
	}

	return result;
}

async function completeDescharged(discharged) {
	discharged.observation = discharged.name.toLocaleUpperCase();
	let name = await invModel.productFindById(discharged.fk_idProduct);
	discharged.name = name[0].name;
	return discharged;
}

module.exports = bajasController;
