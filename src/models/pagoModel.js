const db = require('../database/connection');

const pagoModel = {};

pagoModel.listPago = async (date) => {
	const pagos = await db.query(`SELECT * FROM payturn WHERE date = '${date}'`);
	return pagos;
};

pagoModel.listPagoPeriod = async (dateFirst, dateLast) => {
	const pagos = await db.query(`SELECT SUM(p.price) price, p.idPayTurn, p.idUserPayTurn, p.date, p.time, p.fk_idTurn FROM payturn p WHERE date BETWEEN '${dateFirst}' AND '${dateLast}' GROUP BY p.idUserPayTurn`);
	return pagos;
};

pagoModel.totalP = async (date) => {
	const total = await db.query(
		`SELECT SUM(price) AS total FROM payturn WHERE date = '${date}'`
	);
	return total;
};

pagoModel.findByIdDate = async (idUser, date) => {
	const pay = await db.query(
		`SELECT * FROM payturn WHERE idUserPayTurn = ${idUser} AND date = '${date}'`
	);
	return pay;
};

pagoModel.findByTurnDate = async (idTurn, date) => {
	const pay = await db.query(
		`SELECT * FROM payturn WHERE idPayTurn = ${idTurn} AND date = '${date}'`
	);
	return pay;
};

pagoModel.insertPay = async (idUserPayTurn, price, date, time, turnId) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO payturn (idPayTurn, price, idUserPayTurn, date, time, fk_idTurn) VALUES (NULL, '${price}', '${idUserPayTurn}', '${date}', '${time}', '${turnId}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

pagoModel.updatePay = async (idPayTurn, price) => {
	let result = false;

	try {
		await db.query(
			`UPDATE payturn SET price = '${price}' WHERE payturn.idPayTurn = ${idPayTurn}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

pagoModel.deletePay = async (idPayTurn) => {
	let result = false;

	try {
		await db.query(
			`DELETE FROM payturn WHERE payturn.idPayTurn = ${idPayTurn}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

module.exports = pagoModel;
