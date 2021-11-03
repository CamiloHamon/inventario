const db = require('../database/connection');

const turnoModel = {};

turnoModel.insert = async (idUser, date, timeStart) => {
	const startTurn = await db.query(
		`INSERT INTO turn (idTurn, date, timeStart, timeEnd, fk_idUser) VALUES (NULL, '${date}', '${timeStart}', NULL, '${idUser}')`
	);
	return startTurn;
};

turnoModel.findByDate = async (date) => {
	const turnos = await db.query(
		`SELECT t.*, p.* FROM turn t INNER JOIN user u ON u.idUser = t.fk_idUser INNER JOIN position p ON p.idPosition = u.fk_idPosition WHERE t.date = '${date}' ORDER BY p.idPosition`
	);
	return turnos;
};

turnoModel.findByIdUser = async (idUser, date) => {
	const turn = await db.query(
		`SELECT * FROM turn WHERE fk_idUser = ${idUser} AND date = '${date}'`
	);
	return turn;
};

turnoModel.findUserByidTurn = async (idTurn) => {
	const userTurn = (
		await db.query(
			`SELECT fk_idUser AS idUser FROM turn WHERE idTurn = ${idTurn}`
		)
	)[0].idUser;

	return userTurn;
};

turnoModel.findUserByidTurnInfo = async (idTurn) => {
	const userTurn = (
		await db.query(
			`SELECT t.timeStart, t.timeEnd, p.name AS cargo, u.name, u.imgProfile FROM turn t INNER JOIN user u ON t.fk_idUser = u.idUser INNER JOIN position p ON u.fk_idPosition = p.idPosition WHERE t.idTurn = ${idTurn}`
		)
	)[0];
	return userTurn;
};

module.exports = turnoModel;
