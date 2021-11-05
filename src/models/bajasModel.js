const db = require('../database/connection');

const bajasModel = {};

bajasModel.listDischarged = async (date) => {
	const discharged = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY d.idDischarged) no,  d.idDischarged, d.amount, d.fk_idProduct, dd.name AS descripcion, p.name FROM discharged d INNER JOIN dischargeddetails dd ON d.fk_idDischargedDetails = dd.iddischargedDetails INNER JOIN product p ON d.fk_idProduct = p.idProduct WHERE d.date = '${date}'`
	);
	return discharged;
};

bajasModel.listDischargedPeriod = async (dateFirst, dateLast) => {
	const discharged = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY d.idDischarged) no,  d.idDischarged, SUM(d.amount) amount, d.fk_idProduct, dd.name AS descripcion, p.name FROM discharged d INNER JOIN dischargeddetails dd ON d.fk_idDischargedDetails = dd.iddischargedDetails INNER JOIN product p ON d.fk_idProduct = p.idProduct WHERE d.date BETWEEN '${dateFirst}' AND '${dateLast}' GROUP BY d.fk_idProduct`
	);
	return discharged;
};

bajasModel.discharged = async (idDis, date) => {
	const discharged = await db.query(
		`SELECT d.idDischarged, d.amount, d.fk_idProduct, dd.name AS descripcion, p.name FROM discharged d INNER JOIN dischargeddetails dd ON d.fk_idDischargedDetails = dd.iddischargedDetails INNER JOIN product p ON d.fk_idProduct = p.idProduct WHERE d.idDischarged = ${idDis} AND d.date = '${date}'`
	);
	return discharged[0];
};

bajasModel.list = async () => {
	const list = await db.query('SELECT * FROM dischargeddetails');
	return list;
};

bajasModel.insertList = async (name) => {
	let result = false;

	try {
		result = await db.query(
			`INSERT INTO dischargeddetails (iddischargeddetails, name) VALUES (NULL, '${name}')`
		);
	} catch (error) {
		console.log(error);
	}

	return result;
};

bajasModel.findByIdDetails = async (idD) => {
	const details = await db.query(
		`SELECT name FROM dischargeddetails WHERE iddischargedDetails = ${idD}`
	);
	return details;
};

bajasModel.findById = async (idD, date) => {
	const discharged = await db.query(
		`SELECT * FROM discharged WHERE date = '${date}' AND idDischarged = ${idD}`
	);
	return discharged;
};

bajasModel.update = async (idD, amount, idDetails) => {
	let result = false;
	try {
		await db.query(
			`UPDATE discharged SET amount = '${amount}', fk_idDischargedDetails = '${idDetails}' WHERE discharged.idDischarged = ${idD}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

bajasModel.insertBaja = async (idProd, idTurn, idDis, amount, date, time) => {
	let result = false;

	try {
		await db.query(
			`INSERT INTO discharged (idDischarged, amount, date, time, fk_idProduct, fk_idTurn, fk_idDischargedDetails) VALUES (NULL, '${amount}', '${date}', '${time}', '${idProd}', '${idTurn}', '${idDis}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

bajasModel.caseSpecial = async () => {
	const cases = await db.query(
		'SELECT * FROM product WHERE discharged = 1 and amount IS NULL ORDER BY idProduct ASC'
	);
	return cases;
};

bajasModel.delete = async (idDis) => {
	let result = false;

	try {
		await db.query(
			`DELETE FROM discharged WHERE discharged.idDischarged = ${idDis}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

module.exports = bajasModel;
