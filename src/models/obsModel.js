const db = require('../database/connection');

const obsModel = {};

obsModel.list = async (date) => {
	const obs = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY obs.idObservationSales) no ,obs.*, u.name FROM observationsales obs INNER JOIN user u ON u.idUser = obs.idUserOS WHERE obs.date = '${date}' AND obs.status = 1`
	);
	return obs;
};

obsModel.findByIdDate = async (idObs, date) => {
	const obs = await db.query(
		`SELECT obs.* FROM observationsales obs WHERE obs.date = '${date}' AND obs.status = 1 AND obs.idObservationSales = ${idObs}`
	);
	return obs;
};

obsModel.update = async (idObs) => {
	let result = false;
	try {
		await db.query(
			`UPDATE observationsales SET status = '0' WHERE observationsales.idObservationSales = ${idObs}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

obsModel.insert = async (idUser, obs, date, time) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO observationsales (idObservationSales, description, date, time, status, idUserOS) VALUES (NULL, '${obs}', '${date}', '${time}', '1', '${idUser}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

obsModel.delete = async (idObs) => {
	let result = false;
	try {
		await db.query(
			`DELETE FROM observationsales WHERE observationsales.idObservationSales = ${idObs}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

module.exports = obsModel;
