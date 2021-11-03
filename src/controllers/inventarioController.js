const invModel = require('../models/invModel');
const moment = require('../middlewares/moment');
const flMessage = require('../helpers/flash');
const productSpecial = require('../models/prodCaSpecialModel');

const invController = {};

invController.view = async (req, res, next) => {
	const view = { alert: [], error: [] };
	//view.products = await invView();

	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/inventario/inventario', view);
};

invController.listProducts = async (req, res, next) => {
	let products = await invView();
	products = JSON.stringify(products);

	res.send(products);
};

invController.listInputs = async (req, res, next) => {
	const view = { inputs: [], alert: [], error: [] };
	const date = moment.toDay();

	view.inputs = await invModel.listInputs(date);

	for (let i = 0; i < view.inputs.length; i++) {
		view.inputs[i].date = moment.date(view.inputs[i].date);
		view.inputs[i].price = new Intl.NumberFormat().format(view.inputs[i].price);
	}

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/inventario/entradas', view);
};

invController.listEntradas = async (req, res, next) => {
	const inputs = await invModel.listInputs(moment.toDay());

	for (let i = 0; i < inputs.length; i++) {
		inputs[i].date = moment.date(inputs[i].date);
	}

	res.send(JSON.stringify(inputs));
};

invController.inputEdit = async (req, res, next) => {
	const view = { inProduct: [], alert: [], error: [] };
	const id = req.params.id;

	const date = moment.toDay();
	const input = await invModel.inputFindById(id, date);

	if (input.length > 0) {
		const infoInput = await invModel.infoInput(id);
		view.inProduct = infoInput[0];
		return res.render('pages/inventario/editar-entrada', view);
	}

	res.redirect('/inventario/entradas');
};

invController.inputEditForm = async (req, res, next) => {
	const id = req.params.id;
	let { price, amount } = req.body;

	price = Number(price);
	amount = parseFloat(amount);

	let info = 'Entrada actualizada correctamente.',
		error = '',
		details = '';

	let result = false;

	if (!isNaN(price) && !isNaN(amount)) {
		const date = moment.toDay();
		const input = await invModel.inputFindById(id, date);

		if (input.length > 0) {
			const currentAmount = parseFloat(input[0].amount),
				idProduct = input[0].fk_idProduct;

			const product = await invModel.productFindById(idProduct);

			if (product.length > 0) {
				const amountProduct = Number(product[0].amount);
				let resta = currentAmount - amount;
				let opt = true; //true restar, false sumar
				if (resta < 0) {
					opt = false;
					resta *= -1;
				}

				if (amountProduct >= resta) {
					let updateAmount = false;
					if (opt) {
						//restar
						updateAmount = await invModel.subAmntProIn(idProduct, resta);
					} else {
						//sumar
						updateAmount = await invModel.sumAmntProIn(idProduct, resta);
					}

					if (updateAmount) {
						result = await invModel.updateInput(id, price, amount);
					} else details = 'internal error';
				} else {
					details = 'no hay suficiente inventario';
				}
			} else details = 'producto inhabilitado';
		}
	} else details = 'entrada no existe';

	error = `No se pudo actualizar la entrada porque ${details}.`;

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/inventario/entradas');
};

invController.deleteInput = async (req, res, next) => {
	const id = req.params.id;

	let info = 'Entrada eliminada correctamente.',
		error = '',
		details = '';

	let result = false;

	const date = moment.toDay();
	const input = await invModel.inputFindById(id, date);

	if (input.length > 0) {
		const currentAmount = parseFloat(input[0].amount),
			idProduct = input[0].fk_idProduct;

		const product = await invModel.productFindById(idProduct);

		if (product.length > 0) {
			const amountProduct = Number(product[0].amount);

			if (amountProduct >= currentAmount) {
				const updateAmount = await invModel.subAmntProIn(
					idProduct,
					currentAmount
				);

				if (updateAmount) {
					result = await invModel.deleteInput(id);
				} else details = 'internal error';
			} else {
				details = 'no hay suficiente inventario';
			}
		} else details = 'producto inhabilitado';
	}

	error = `No se pudo eliminar la entrada porque ${details}.`;

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/inventario/entradas');
	/**/
};

invController.addInput = async (req, res, next) => {
	const view = { products: [], alert: [], error: [] };
	view.products = await invModel.listProInv();
	res.render('pages/inventario/agregar-entrada', view);
};

invController.addInputForm = async (req, res, next) => {
	let { product, price, amount } = req.body;

	product = parseInt(product);
	price = parseFloat(price);
	amount = parseFloat(amount);

	const info = 'Se ha registrado la entrada correctamente.',
		error = 'No se ha podido registrar la entrada.';

	let result = false;

	const idsEnables = await idsProducts();

	if (!isNaN(product) && !isNaN(price) && !isNaN(amount)) {
		const isExist = idsEnables.includes(product);

		if (isExist) {
			const date = moment.toDay(),
				time = moment.currentTime();

			const insertInput = await invModel.insertInput(
				product,
				price,
				amount,
				date,
				time,
				req.user.idUser
			);

			if (insertInput) {
				const updateAmount = await invModel.sumAmntProIn(product, amount);
				if (updateAmount) result = true;
			}
		}
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/inventario/entradas');
};

invController.createProduct = async (req, res, next) => {
	const view = { ids: [], mainProd: [], info: [], error: [] };

	const ids = await invModel.listIdProduct();

	view.ids = idsEnables(ids);

	view.mainProd = await invModel.productInv();

	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/inventario/crear-producto', view);
};

invController.createProductForm = async (req, res, next) => {
	const { codigo, nombre, inventario, carta, productos } = req.body;

	let info = '',
		error = 'No fue posible crear el producto.',
		result = false;

	const nombreFinally = nombre.trim();

	let valName = await validateName(nombreFinally);

	if (valName) {
		let insertId = await newId(codigo),
			insertInv = null,
			insertMenu = { menu: 0, precio: 0 },
			idProdSpecial = 1;

		const checkInv = inventario.check,
			checkCarta = carta.check;

		if (checkInv || checkCarta) {
			if (checkInv) {
				const cantidad = Number(inventario.cantidad);

				if (!isNaN(cantidad) && cantidad > 0) {
					insertInv = cantidad;
				}
			}
			if (checkCarta) {
				const precio = Number(carta.precio);
				if (!isNaN(precio) && precio > 499) {
					insertMenu.menu = 1;
					insertMenu.precio = precio;

					if (productos.length > 0) {
						//validar que los productos existen
						let val = false;
						for (let i = 0; i < productos.length; i++) {
							const infoProd = await invModel.productFindById(productos[i].id);
							if (infoProd.length > 0) val = true;
							else {
								val = false;
								break;
							}
						}

						if (val) {
							insertInv = null;
							//insertar producto case special
							const insertProIdSpecial =
								await productSpecial.insertProdSpecial();

							idProdSpecial = insertProIdSpecial.insertId;
							for (const p of productos) {
								await productSpecial.insertDetails(
									p.id,
									p.amount,
									idProdSpecial
								);
							}
							//insertar por cada producto el datalle del producto especial
						}
					}
				}
			}

			const insertProduct = await invModel.insertProduct(
				insertId,
				nombreFinally,
				insertInv,
				insertMenu.menu,
				idProdSpecial
			);

			if (insertProduct) {
				result = true;
				if (insertMenu.menu) {
					result = await invModel.inHiPrice(
						insertProduct.insertId,
						insertMenu.precio
					);
					info = `Producto ${nombreFinally} creado. Con Codigo: ${insertProduct.insertId}`;
				}
			}
		}
	} else {
		error = `El producto ${nombreFinally} ya existe.`;
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.send(result);
};

invController.listProductMenu = async (req, res, next) => {
	const products = await invModel.listMenu();
	res.send(JSON.stringify(products));
};

async function validateName(nombre) {
	let result = true;
	const nombresProduct = await invModel.listNames();
	for (const nP of nombresProduct) {
		const nombreP = nP.name.toLowerCase();
		const auxNombre = nombre.toLowerCase();
		if (nombreP === auxNombre) {
			result = false;
			break;
		}
	}

	return result;
}

async function newId(codigo) {
	let insertCod = -1;
	const idsAllProducts = await invModel.listIdProduct();
	const idsEn = idsEnables(idsAllProducts);

	if (!isNaN(codigo) && codigo > 0) {
		//validar que el codigo ingresado si este disponible;
		const existId = idsEn.indexOf(codigo);
		if (existId !== -1) {
			insertCod = codigo;
		} else insertCod = Number(idsEn[0]);
	} else {
		//buscar un codigo para este producto
		insertCod = Number(idsEn[0]);
	}

	return insertCod;
}

invController.carta = async (req, res, next) => {
	const view = { products: [], alert: [], error: [] };
	view.products = await invModel.listMenu();

	for (let p of view.products) {
		p.price = new Intl.NumberFormat().format(p.price);
	}
	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/inventario/carta-menu', view);
};

invController.editProduct = async (req, res, next) => {
	const view = { product: [], alert: [], error: [] };
	const id = req.params.id;

	const product = await invModel.productFindById(id);

	if (product.length > 0 && product[0].amount !== null) {
		view.product = product[0];
	} else {
		res.redirect('/inventario');
		return;
	}
	res.render('pages/inventario/editar-producto', view);
};

invController.listNames = async (req, res, next) => {
	const names = await invModel.listNames();
	res.send(JSON.stringify(names));
};

invController.editProductForm = async (req, res, next) => {
	const name = req.body.name;
	const id = parseInt(req.params.id);

	let result = false;

	const info = 'Producto editado correctamente.',
		error = 'No se ha podido editar el producto.';

	const product = await invModel.productFindById(id);

	let val = false;

	if (
		product.length > 0 &&
		product[0].idProduct === id &&
		product[0].amount > 0
	) {
		val = true;
	}

	if (val) {
		const updateName = await invModel.updateNamePro(id, name);
		if (updateName) result = true;
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/inventario');
};

invController.editProductMenu = async (req, res, next) => {
	const view = { product: [], productsInv: [], alert: [], error: [] };
	const id = req.params.id;
	const product = await invModel.infoProMenu(id);

	if (product.length > 0) {
		view.product = product[0];
		if (product[0].caseSpecial !== 1) {
			view.productsInv = await invModel.findByIdSpecial(product[0].caseSpecial);
		}
	} else {
		res.redirect('/inventario/carta');
		return;
	}

	res.render('pages/inventario/editar-producto-menu', view);
};

invController.editProductMenuForm = async (req, res, next) => {
	const { name, price } = req.body;
	const id = req.params.id;

	let result = false;

	const info = 'Producto editado correctamente.',
		error = 'No se ha podido editar el producto.';

	const product = await invModel.productFindById(id);

	const priceProduct = Number(price);

	if (product.length > 0 && name && priceProduct > 499) {
		const updateName = await invModel.updateNamePro(id, name);
		if (updateName) {
			const historyPrice = await invModel.inHiPrice(id, price);
			if (historyPrice) result = true;
		}
	}

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/inventario/carta');
};

function idsEnables(ids) {
	let result = [];
	let value = 1;

	for (let id of ids) {
		for (let i = 0; i < 100; i++) {
			if (value !== id.idProduct) {
				result.push(value);
				value++;
				if (result.length === 10) break;
			} else {
				break;
			}
		}
		value++;
		if (result.length === 10) break;
	}

	if (result.length < 0) {
		const index = ids[ids.length - 1];
		let i = 1;

		while (i <= 10) {
			result.push(i + index);
			i++;
		}
	}

	return result;
}

async function invView() {
	let products = [];

	const infoProd = await invModel.listProInv(); //los productos para inventariar

	const date = moment.toDay();

	//iterar los productos inventariados
	for (let i = 0; i < infoProd.length; i++) {
		const idProduct = infoProd[i].idProduct;
		let inputs = await invModel.countInputProd(idProduct, date); //entradas que tuvo ese producto
		const idProducts = await searchProducts(infoProd[i]); //cuantos productos dependen de el

		let amountSell = 0,
			amountDis = 0,
			amountTrust = 0;

		const arrayIdSell = [],
			arrayIdDis = [],
			arrayIdTrust = [];

		if (valCart(infoProd[i])) {
			const cantSell = await invModel.countSalesProd(
				infoProd[i].idProduct,
				date
			);
			if (cantSell) {
				amountSell += cantSell;
				arrayIdSell.push(infoProd[i].idProduct);
			}

			const cantDis = await invModel.countDischargedProd(
				infoProd[i].idProduct,
				date
			);
			if (cantDis) {
				amountDis += cantDis;
				arrayIdDis.push(infoProd[i].idProduct);
			}

			const cantTrust = await invModel.countFiadProd(
				infoProd[i].idProduct,
				date
			);
			if (cantTrust) {
				amountTrust += cantDis;
				arrayIdTrust.push(infoProd[i].idProduct);
			}
		}

		for (const prod of idProducts) {
			if (arrayIdSell.indexOf(prod.idProduct) === -1) {
				const cantSell = await invModel.countSalesProd(prod.idProduct, date);
				if (cantSell) amountSell += cantSell * prod.amount;
			}

			if (arrayIdDis.indexOf(prod.idProduct) === -1) {
				const cantDis = await invModel.countDischargedProd(
					prod.idProduct,
					date
				);
				if (cantDis) amountDis += cantDis * prod.amount;
			}

			if (arrayIdTrust.indexOf(prod.idProduct) === -1) {
				const cantTrust = await invModel.countFiadProd(prod.idProduct, date);
				if (cantTrust) amountTrust += cantTrust * prod.amount;
			}
		}

		if (!inputs) inputs = 0;

		const product = {
			idProduct: infoProd[i].idProduct,
			name: infoProd[i].name,
			amount:
				infoProd[i].amount + amountSell + amountDis + amountTrust - inputs,
			inputs,
			sell: amountSell,
			discharged: amountDis,
			fiados: amountTrust,
		};

		product.exist =
			product.amount + inputs - amountSell - amountDis - amountTrust;
		products.push(product);
	}

	return products;
}

function valCart(product) {
	if (product.amount && product.menu === 1) return true;

	return false;
}

async function searchProducts(product) {
	const { idProduct, fk_idProdCaseSpecial } = product;
	const caseSpecial = Number(fk_idProdCaseSpecial);
	const result = [];
	if (!isNaN(caseSpecial) && caseSpecial === 1) {
		const prodSpecial = await productSpecial.findByIdProd(idProduct); // productos que dependen del principal

		if (prodSpecial.length > 0) {
			for (const idCS of prodSpecial) {
				const productsSpecials = await invModel.productFindByIdSpecial(
					idCS.idProduct
				);
				for (const p of productsSpecials) {
					result.push({ idProduct: p.idProduct, amount: idCS.amount });
				}
			}
		} else result.push({ idProduct, amount: 1 });
	}

	return result;
}

async function idsProducts() {
	let result = [];
	const ids = await invModel.listProInv();

	for (let i = 0; i < ids.length; i++) {
		const id = ids[i].idProduct;
		result.push(id);
	}

	return result;
}

module.exports = invController;
