const db = require('../database/connection');

const fiadosModel = {};

fiadosModel.list = async () => {
	const clients = await db.query(
		'SELECT DISTINCT(c.idClient) AS idClient FROM client c INNER JOIN trust t ON c.idClient = t.fk_idClient WHERE c.status = 1 AND t.status = 1 ORDER BY t.idTrust'
	);

	let result = [];

	for (const c of clients) {
		const trust = await db.query(
			`SELECT SUM(t.amount) amount, (t.date) date, c.idClient, c.name, c.complement, SUM(t.amount * t.price) total FROM product p INNER JOIN trust t ON t.fk_idProduct = p.idProduct INNER JOIN client c ON c.idClient = t.fk_idClient WHERE t.fk_idClient = ${c.idClient} AND t.status = 1 ORDER BY t.idTrust;`
		);
		result.push(trust[0]);
	}

	return result;
};

fiadosModel.listTrust = async (idClient) => {
	const trusts = await db.query(
		`SELECT t.*, p.name AS nameP, u.name, SUM(t.price * t.amount) total FROM trust t INNER JOIN turn ON turn.idTurn = t.fk_idTurn INNER JOIN user u ON u.idUser = turn.fk_idUser INNER JOIN product p ON t.fk_idProduct = p.idProduct WHERE t.fk_idClient = ${idClient} AND t.status = 1 GROUP BY t.idTrust ORDER BY t.time`
	);
	return trusts;
};

fiadosModel.findByIdClient = async (idClient) => {
	const trust = await db.query(
		`SELECT DISTINCT(c.idClient) AS idClient FROM client c INNER JOIN trust t ON c.idClient = t.fk_idClient WHERE c.status = 1 AND c.idClient = ${idClient}`
	);
	return trust;
};

fiadosModel.findById = async (idTrust) => {
	const trust = await db.query(
		`SELECT p.name, t.* FROM trust t INNER JOIN product p ON t.fk_idProduct = p.idProduct WHERE t.idTrust = ${idTrust} AND t.status = 1`
	);
	return trust;
};

fiadosModel.findByIdClientIdTrust = async (idTrust, idClient) => {
	const trust = await db.query(
		`SELECT * FROM trust t WHERE t.idTrust = ${idTrust} AND t.fk_idClient = ${idClient} AND t.status = 1`
	);
	return trust;
};

fiadosModel.total = async (idClient) => {
	const total = await db.query(
		`SELECT SUM(t.amount * t.price) total FROM product p INNER JOIN trust t ON t.fk_idProduct = p.idProduct WHERE t.status = 1 AND t.fk_idClient = ${idClient}`
	);
	return total[0].total;
};

fiadosModel.totalAll = async () => {
	const total = await db.query(
		'SELECT SUM(t.amount * t.price) total FROM product p INNER JOIN trust t ON t.fk_idProduct = p.idProduct WHERE t.status = 1'
	);

	return total[0].total;
};
fiadosModel.update = async (idTrust, amount) => {
	let result = false;
	try {
		await db.query(
			`UPDATE trust SET amount = '${amount}' WHERE trust.idTrust = ${idTrust}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

fiadosModel.saldar = async (idTrust, idTurn) => {
	try {
		await db.query(
			`UPDATE trust SET datePay = current_timestamp, idTurnRegisterPay = '${idTurn}', status = '0' WHERE trust.idTrust = ${idTrust}`
		);
	} catch (error) {
		console.log(error);
	}
};

fiadosModel.saldadosHoy = async (date) => {
	const fiados = await db.query(
		`SELECT c.name AS cliente, t.price, p.name AS producto FROM trust t INNER JOIN client c ON c.idClient = t.fk_idClient INNER JOIN product p ON p.idProduct = t.fk_idProduct WHERE t.datePay > '${date} 00:00:00' AND t.datePay < '${date} 23:59:59'`
	);
	return fiados;
};

fiadosModel.saldadosPeriod= async (dateFirst, dateLast) => {
	const fiados = await db.query(
		`SELECT c.name AS cliente, t.price, p.name AS producto FROM trust t INNER JOIN client c ON c.idClient = t.fk_idClient INNER JOIN product p ON p.idProduct = t.fk_idProduct WHERE t.datePay > '${dateFirst} 00:00:00' AND t.datePay < '${dateLast} 23:59:59'`
	);
	return fiados;
};

fiadosModel.totalSaldadosHoy = async (date) => {
	const total = await db.query(
		`SELECT SUM(t.price) as total FROM trust t INNER JOIN client c ON c.idClient = t.fk_idClient INNER JOIN product p ON p.idProduct = t.fk_idProduct WHERE t.datePay > '${date} 00:00:00' AND t.datePay < '${date} 23:59:59'`
	);
	return total[0].total;
};

fiadosModel.totalSaldadosPartial = async (dateFirst, dateLast) => {
	const total = await db.query(
		`SELECT SUM(t.price) as total FROM trust t INNER JOIN client c ON c.idClient = t.fk_idClient INNER JOIN product p ON p.idProduct = t.fk_idProduct WHERE t.datePay > '${dateFirst} 00:00:00' AND t.datePay < '${dateLast} 23:59:59'`
	);
	return total[0].total;
};

fiadosModel.delete = async (idTrust) => {
	let result = false;

	try {
		await db.query(`DELETE FROM trust WHERE idTrust = ${idTrust}`);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

fiadosModel.delAll = async (idClient) => {
	let result = false;
	try {
		await db.query(`DELETE FROM trust WHERE fk_idClient = ${idClient}`);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

fiadosModel.totalTrust = async (idTrust) => {
	const totalTrust = await db.query(
		`SELECT SUM(t.amount * t.price) total FROM product p INNER JOIN trust t ON t.fk_idProduct = p.idProduct WHERE t.status = 1 AND t.idTrust = ${idTrust}`
	);
	return totalTrust[0].total;
};

fiadosModel.insertTrust = async (
	idClient,
	idProduct,
	idTurn,
	amount,
	date,
	time,
	price
) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO trust (idTrust, amount, date, time, status, fk_idTurn, fk_idClient, fk_idProduct, price) VALUES (NULL, '${amount}', '${date}', '${time}', '1', '${idTurn}', '${idClient}', '${idProduct}', '${price}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

module.exports = fiadosModel;
