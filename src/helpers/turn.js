const invModel = require('../models/invModel');

const turnHelper = {};

turnHelper.idTurn = (idUser) => {
	let id;
	const idTurn = JSON.parse(localStorage.getItem('turnos'));
	for (const i of idTurn) {
		if (i.idUser === idUser) {
			id = i.idTurn;
		}
	}
	return id;
};

turnHelper.completeInfo = (table) => {
	let n = 1;
	for (const t of table) {
		t.no = n;
		t.price = new Intl.NumberFormat().format(t.price);
		n++;
	}

	return table;
};

turnHelper.searchInsert = (localS, element) => {
	const listLocalS = JSON.parse(localStorage.getItem(localS));
	element = cleanSpace(element.toLowerCase());

	let val = true;
	for (let i = 0; i < listLocalS.length; i++) {
		if (listLocalS[i].indexOf(element) !== -1) {
			element = listLocalS[i];
			i = listLocalS.length;
			val = false;
		}
	}
	if (val) {
		listLocalS.push(element);
		localStorage.setItem(localS, JSON.stringify(listLocalS.sort()));
	}

	return element;
};

turnHelper.updateAmount = async (idProduct, amount, total) => {
	let result = false;
	const product = await turnHelper.casesSpecials(idProduct, amount);
	for (const p of product) {
		try {
			if (total > 0) result = await invModel.sumAmntProIn(p.cod, p.amount);
			else if (total != 0)
				result = await invModel.subAmntProIn(p.cod, p.amount);
			else result = true;
		} catch (error) {
			result = false;
			console.log(error);
		}
	}

	return result;
};

turnHelper.insDisUpAmount = async (idProduct, amount) => {
	let result = false;
	const product = await turnHelper.casesSpecials(idProduct, amount);
	for (const p of product) {
		try {
			result = await invModel.subAmntProIn(p.cod, p.amount);
		} catch (error) {
			result = false;
			console.log(error);
		}
	}
	return result;
};

turnHelper.delUpdaAmount = async (idProduct, amount) => {
	let result = false;
	const product = await turnHelper.casesSpecials(idProduct, amount);
	for (const p of product) {
		try {
			result = await invModel.sumAmntProIn(p.cod, p.amount);
		} catch (error) {
			result = false;
			console.log(error);
		}
	}
	return result;
};

turnHelper.casesSpecials = async (idProduct, amount) => {
	const cases = await invModel.casesSpecial();
	const idCases = turnHelper.completeInfoIds(cases);
	let result = [{ cod: idProduct, amount }];
	if (idCases.includes(idProduct)) {
		result = [];
		if (
			idProduct === 1 ||
			idProduct === 2 ||
			idProduct === 3 ||
			idProduct === 14 ||
			idProduct === 65
		) {
			if (idProduct === 2) amount = amount / 2;
			else if (idProduct === 3 || idProduct === 14) amount = amount * 0.25;
			else if (idProduct === 65) amount = amount * 2;
			result.push({ cod: 101, amount });
		} else if (
			idProduct === 8 ||
			idProduct === 9 ||
			idProduct === 66 ||
			idProduct === 30
		) {
			if (idProduct === 30) amount = amount / 2;
			result.push({ cod: 102, amount });
		} else if (idProduct === 13 || idProduct === 62) {
			result.push({ cod: 103, amount });
		} else if (idProduct === 61) {
			amount = amount / 2;
			const lomo = { cod: 11, amount };
			const pechuga = { cod: 103, amount };
			const carne = { cod: 102, amount };
			result.push(lomo);
			result.push(pechuga);
			result.push(carne);
		}
	}
	return result;
};

turnHelper.completeInfoIds = (idsProducts) => {
	const ids = [];
	for (const p of idsProducts) ids.push(p.idProduct);
	return ids;
};

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

module.exports = turnHelper;
