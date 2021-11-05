const db = require('../database/connection');

const invModel = {};

invModel.listProInv = async () => {
	const products = await db.query(
		'SELECT * FROM product WHERE amount IS NOT NULL AND status = 1 ORDER BY name'
	);
	return products;
};

invModel.listInputs = async (date) => {
	const inputs = await db.query(
		`SELECT product.*, inputproduct.idInputProduct, inputproduct.price, inputproduct.amount AS amountInput, inputproduct.date, inputproduct.time FROM inputproduct INNER JOIN product ON product.idProduct = inputproduct.fk_idProduct WHERE CAST(date AS DATE) = '${date}'`
	);
	return inputs;
};

invModel.listInputsPeriod = async (dateFirst, dateLast) => {
	const inputs = await db.query(
		`SELECT product.*, inputproduct.idInputProduct, SUM(inputproduct.price) AS price, SUM(inputproduct.amount) AS amountInput, inputproduct.date, inputproduct.time FROM inputproduct INNER JOIN product ON product.idProduct = inputproduct.fk_idProduct WHERE CAST(date AS DATE) BETWEEN '${dateFirst}' AND '${dateLast}' GROUP BY inputproduct.fk_idProduct`
	);
	return inputs;
};


invModel.listMenu = async () => {
	const menu = await db.query(
		'SELECT product.idProduct, product.name, price, date FROM historyprice S INNER JOIN product ON product.idProduct = S.fk_idProduct WHERE date=( SELECT MAX(date) FROM historyprice WHERE fk_idProduct = S.fk_idProduct) AND product.menu = 1 AND product.status = 1 ORDER BY product.idProduct'
	);
	return menu;
};

invModel.listMenuDis = async () => {
	const menu = await db.query(
		'SELECT * FROM product WHERE fk_idProdCaseSpecial != 1 OR (amount is not null AND menu = 1) AND status = 1 ORDER BY idProduct ASC'
	);
	return menu;
};

invModel.listMenuDisIds = async () => {
	const ids = await db.query(
		'SELECT idProduct FROM product WHERE fk_idProdCaseSpecial != 1 OR (amount is not null AND menu = 1) AND status = 1 ORDER BY idProduct ASC'
	);
	return ids;
};

invModel.productFindById = async (id) => {
	const product = await db.query(
		`SELECT * FROM product WHERE idProduct = '${id}' AND status = '1'`
	);
	return product;
};

invModel.productFindByIdSpecial = async (idCaseSpecial) => {
	const product = await db.query(
		`SELECT * FROM product WHERE fk_idProdCaseSpecial = '${idCaseSpecial}' AND status = '1'`
	);
	return product;
};

invModel.insertInput = async (idProduct, price, amount, date, time, idUser) => {
	let result = false;

	try {
		await db.query(
			`INSERT INTO inputproduct (idInputProduct, price, amount, date, time, fk_idUser, fk_idProduct) VALUES (NULL, '${price}', '${amount}', '${date}', '${time}', '${idUser}', '${idProduct}')`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.insertProduct = async (
	idProduct,
	name,
	amount,
	minAmount,
	menu,
	idCaseSpecial
) => {
	let insert = '';

	try {
		insert = await db.query(
			`INSERT INTO product (idProduct, name, amount, menu, status, fk_idProdCaseSpecial, minAmount) VALUES (${idProduct}, '${name}', ${amount}, '${menu}', '1', '${idCaseSpecial}', '${minAmount}')`
		);
	} catch (error) {
		console.log(error);
	}

	return insert;
};

invModel.listNames = async () => {
	const names = await db.query('SELECT name FROM product WHERE status = 1');
	return names;
};

invModel.upAmoCrePro = async (idProduct, amount) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product SET amount = '${amount}' WHERE idProduct = '${idProduct}' AND status = 1`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

invModel.updateNamePro = async (idProduct, name) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product SET name = '${name}' WHERE idProduct = '${idProduct}'`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

invModel.inHiPrice = async (idProduct, price) => {
	let result = false;

	try {
		await db.query(
			`INSERT INTO historyprice (idHistoryPrice, price, date, fk_idProduct) VALUES (NULL, '${price}', current_timestamp(), '${idProduct}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

invModel.countInputProd = async (idProduct, date) => {
	let countInPrd = await db.query(
		`SELECT SUM(inputproduct.amount) AS cant FROM inputproduct WHERE CAST(date AS DATE) = '${date}' AND fk_idProduct = ${idProduct}`
	);
	countInPrd = countInPrd[0].cant;
	return countInPrd;
};

invModel.countSalesProd = async (idProduct, date) => {
	let amount = await db.query(
		`SELECT SUM(amount) AS cant FROM sales WHERE CAST(date AS DATE) = '${date}' AND fk_idProduct = ${idProduct}`
	);
	amount = amount[0].cant;
	return amount;
};

invModel.countFiadProd = async (idProduct, date) => {
	let amount = await db.query(
		`SELECT SUM(amount) AS cant FROM trust WHERE CAST(date AS DATE) = '${date}' AND fk_idProduct = 1 AND status = 1 AND fk_idProduct = ${idProduct}`
	);
	amount = amount[0].cant;
	return amount;
};

invModel.countDischargedProd = async (idProduct, date) => {
	let amount = await db.query(
		`SELECT SUM(amount) AS cant FROM discharged WHERE CAST(date AS DATE) = '${date}' AND fk_idProduct = ${idProduct}`
	);
	amount = amount[0].cant;
	return amount;
};

invModel.infoInput = async (idInput) => {
	const input = await db.query(
		`SELECT product.*, inputproduct.idInputProduct, inputproduct.price, inputproduct.amount AS amountInput, inputproduct.date, inputproduct.time FROM inputproduct INNER JOIN product ON product.idProduct = inputproduct.fk_idProduct WHERE idInputProduct = ${idInput}`
	);
	return input;
};

invModel.inputFindById = async (idInput, date) => {
	const input = await db.query(
		`SELECT * FROM inputproduct WHERE idInputProduct = ${idInput} AND date = '${date}'`
	);
	return input;
};

invModel.infoProMenu = async (idProduct) => {
	const product = await db.query(
		`SELECT product.idProduct, product.name, product.fk_idProdCaseSpecial AS caseSpecial, price, date FROM historyprice S INNER JOIN product ON product.idProduct = S.fk_idProduct WHERE date=( SELECT MAX(date) FROM historyprice WHERE fk_idProduct = S.fk_idProduct) AND product.idProduct = ${idProduct} ORDER BY product.idProduct`
	);
	return product;
};

invModel.findByIdSpecial = async (idCaseSpecial) => {
	const products = await db.query(
		`SELECT d.amount, d.idProduct, p.name FROM detailsprodcasespecial d INNER JOIN productcasespecial pcs ON d.fk_idProductCaseSpecial = pcs.idproductCaseSpecial INNER JOIN product p ON d.idProduct = p.idProduct WHERE pcs.idproductCaseSpecial = ${idCaseSpecial}`
	);
	return products;
};

invModel.updateInput = async (idInput, price, amount) => {
	let result = false;

	try {
		await db.query(
			`UPDATE inputproduct SET price = '${price}', amount = '${amount}' WHERE inputproduct.idInputProduct = ${idInput}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.deleteInput = async (idInput) => {
	let result = false;

	try {
		await db.query(
			`DELETE FROM inputproduct WHERE inputproduct.idInputProduct = ${idInput}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.subInUpAmoPro = async (idInput) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product p JOIN inputproduct i ON p.idProduct = i.fk_idProduct SET p.amount = p.amount - i.amount WHERE i.idInputProduct = ${idInput}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.sumAmountPro = async (idInput) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product p JOIN inputproduct i ON p.idProduct = i.fk_idProduct SET p.amount = p.amount + i.amount WHERE i.idInputProduct = ${idInput}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.subAmntProIn = async (idProduct, amount) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product p SET p.amount = p.amount - ${amount} WHERE p.idProduct = ${idProduct}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.sumAmntProIn = async (idProduct, amount) => {
	let result = false;

	try {
		await db.query(
			`UPDATE product p SET p.amount = p.amount + ${amount} WHERE p.idProduct = ${idProduct}`
		);
		result = true;
	} catch (error) {}

	return result;
};

invModel.listIdProduct = async () => {
	const ids = await db.query(
		'SELECT product.idProduct FROM product ORDER BY 1'
	);
	return ids;
};

invModel.casesSpecial = async () => {
	const cases = await db.query(
		'SELECT * FROM product WHERE discharged = 1 and amount IS NULL ORDER BY idProduct ASC'
	);
	return cases;
};

invModel.productInv = async () => {
	const cases = await db.query(
		'SELECT * FROM product p WHERE p.amount IS NOT NULL ORDER BY p.idProduct'
	);
	return cases;
};

invModel.totalInputs = async (date) => {
	const total = await db.query(
		`SELECT SUM(i.price) as total FROM inputproduct i WHERE i.date = '${date}'`
	);
	return total[0].total;
};

invModel.totalInputsPartial = async (dateFirst, dateLast) => {
	const total = await db.query(
		`SELECT SUM(i.price) as total FROM inputproduct i WHERE i.date BETWEEN '${dateFirst}' AND '${dateLast}'`
	);
	return total[0].total;
};

module.exports = invModel;
