const db = require('../database/connection');

const venModel = {};

venModel.list = async (date) => {
	const vendido = await db.query(
		`SELECT DISTINCT(s.fk_idProduct) AS idProduct FROM sales s WHERE s.date = '${date}' ORDER BY s.fk_idProduct`
	);

	let result = [];
	for (const v of vendido) {
		const product = await db.query(
			`SELECT p.idProduct, p.name, SUM(s.amount) amount, s.idSales, SUM(s.amount * h.price) total, h.price AS unidad FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date = '${date}' AND s.fk_idProduct = ${v.idProduct}`
		);
		result.push(product[0]);
	}

	return result;
};

venModel.listPeriod = async (date, dateFirst, dateLast) => {
	const vendido = await db.query(
		`SELECT DISTINCT(s.fk_idProduct) AS idProduct FROM sales s WHERE s.date BETWEEN '${dateFirst}' AND '${dateLast}' ORDER BY s.fk_idProduct`
	);

	let result = [];
	for (const v of vendido) {
		const product = await db.query(
			`SELECT p.idProduct, p.name, SUM(s.amount) amount, s.idSales, SUM(s.amount * h.price) total, h.price AS unidad FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date BETWEEN '${dateFirst}' AND '${dateLast}' AND s.fk_idProduct = ${v.idProduct}`
		);
		result.push(product[0]);
	}

	return result;
};

venModel.findById = async (idSale, date) => {
	const venta = await db.query(
		`SELECT * FROM sales WHERE idSales = ${idSale} AND date = '${date}'`
	);
	return venta;
};

venModel.findByIdPro = async (idProduct, date) => {
	const sales = await db.query(
		`SELECT * FROM sales WHERE fk_idProduct = ${idProduct} AND date = '${date}'`
	);
	return sales;
};

venModel.delAll = async (idProduct, date) => {
	let result = false;
	try {
		await db.query(
			`DELETE FROM sales WHERE fk_idProduct = ${idProduct} AND date = '${date}'`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

venModel.delete = async (idSale, date) => {
	let result = false;
	try {
		await db.query(
			`DELETE FROM sales WHERE idSales = ${idSale} AND date = '${date}'`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

venModel.update = async (idSale, amount) => {
	let result = false;
	try {
		await db.query(
			`UPDATE sales SET amount = '${amount}' WHERE sales.idSales = ${idSale}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

venModel.infoSale = async (idSale, date) => {
	const venta = await db.query(
		`SELECT p.idProduct, p.name, s.amount, s.idSales, SUM(s.amount * h.price) total FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date = '${date}' AND s.idSales = ${idSale}`
	);
	return venta[0];
};

venModel.seeSale = async (idProduct, date) => {
	const seeSale = await db.query(
		`SELECT s.idSales AS no, s.*, u.name, SUM(h.price * s.amount) total FROM sales s INNER JOIN historyprice h ON h.fk_idProduct = s.fk_idProduct INNER JOIN turn ON turn.idTurn = s.fk_idTurn INNER JOIN user u ON u.idUser = turn.fk_idUser WHERE s.date = '${date}' AND h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.fk_idProduct = ${idProduct} GROUP BY s.idSales ORDER BY s.time`
	);
	return seeSale;
};

venModel.totalProduct = async (idProduct, date) => {
	const total = await db.query(
		`SELECT SUM(s.amount * h.price) total FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date = '${date}' AND s.fk_idProduct = ${idProduct}`
	);
	return total[0].total;
};

venModel.total = async (date) => {
	const total = await db.query(
		`SELECT SUM(s.amount * h.price) total FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date = '${date}'`
	);
	return total[0].total;
};

venModel.totalPartial = async (dateFirst, dateLast) => {
	const total = await db.query(
		`SELECT SUM(s.amount * h.price) total FROM historyprice h INNER JOIN product p ON p.idProduct = h.fk_idProduct INNER JOIN sales s ON s.fk_idProduct = p.idProduct WHERE h.date = (SELECT MAX(h2.date) FROM historyprice h2 WHERE h2.fk_idProduct = h.fk_idProduct) AND s.date BETWEEN '${dateFirst}' AND '${dateLast}'`
	);
	return total[0].total;
};

venModel.insertSale = async (idProduct, idTurn, amount, date, time) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO sales (idSales, date, time, amount, fk_idTurn, fk_idProduct) VALUES (NULL, '${date}', '${time}', '${amount}', '${idTurn}', '${idProduct}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

module.exports = venModel;
