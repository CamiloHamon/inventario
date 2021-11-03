const db = require('../database/connection');

const misGastosModel = {};

misGastosModel.dayWeek = async (date) => {
	const firstDay = await db.query(
		`select STR_TO_DATE('${date} Monday', '%X%V %W') AS day`
	);
	return firstDay;
};

misGastosModel.dayWeekLast = async (date) => {
	const firstDay = await db.query(
		`select STR_TO_DATE('${date} Sunday', '%X%V %W') AS day`
	);
	return firstDay;
};

misGastosModel.loans = async (dateFirst, dateLast, idUser) => {
	const loans = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY l.date) no, l.*, u.name FROM loans l INNER JOIN turn t ON l.fk_idTurn = t.idTurn INNER JOIN user u ON u.idUser = t.fk_idUser WHERE l.date BETWEEN '${dateFirst}' AND '${dateLast}' AND l.idUserLoan = ${idUser} AND l.status = 1`
	);

	return loans;
};

misGastosModel.total = async (dateFirst, dateLast, idUser) => {
	const total = await db.query(
		`SELECT SUM(l.price) as total FROM loans l INNER JOIN turn t ON l.fk_idTurn = t.idTurn INNER JOIN user u ON u.idUser = t.fk_idUser WHERE l.date BETWEEN '${dateFirst}' AND '${dateLast}' AND l.idUserLoan = ${idUser} AND l.status = '1'`
	);
	return total[0].total;
};

module.exports = misGastosModel;
