const db = require('../database/connection');
const helper = require('../helpers/helpers');
const moment = require('../middlewares/moment');
const turnoModel = require('./turnoModel');
const userModel = require('./userModel');
const valesModel = {};

valesModel.listLoans = async (date) => {
	const loans = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY loans.idLoans) no, loans.*, user.name, position.name AS position FROM loans INNER JOIN user ON loans.idUserLoan = user.idUser INNER JOIN position ON user.fk_idPosition = position.idPosition WHERE date = '${date}'`
	);
	return loans;
};

valesModel.listLoansPeriod = async (dateFirst, dateLast) => {
	const loans = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY loans.idLoans) no, loans.idLoans, SUM(loans.price) price, user.name, position.name AS position FROM loans INNER JOIN user ON loans.idUserLoan = user.idUser INNER JOIN position ON user.fk_idPosition = position.idPosition WHERE date BETWEEN '${dateFirst}' AND '${dateLast}' AND loans.status = 1 GROUP by loans.idUserLoan`
	);
	return loans;
};

valesModel.listCurrentLoans = async () => {
	const loans = await db.query(
		`SELECT DISTINCT(u.idUser),ROW_NUMBER() OVER(ORDER BY l.idLoans) no, CONCAT(u.name, ' -
			', p.name) AS name, u.imgProfile FROM user u INNER JOIN loans l on l.idUserLoan = u.idUser INNER JOIN position p ON p.idPosition = u.fk_idPosition WHERE l.status = 1 GROUP BY 1 ORDER BY l.idLoans`
	);

	let result = [];

	for (const l of loans) {
		const loan = await db.query(
			`SELECT SUM(l.price) amount FROM loans l WHERE l.idUserLoan = ${l.idUser} AND l.status = 1`
		);
		l.price = helper.decimal(loan[0].amount);
		result.push(l);
	}
	return result;
};

valesModel.listCurrentLoansEmp = async (date) => {
	const loans = await db.query(
		`SELECT DISTINCT(u.idUser),ROW_NUMBER() OVER(ORDER BY l.idLoans) no, CONCAT(u.name, ' - ', p.name) AS name, u.imgProfile FROM user u INNER JOIN loans l on l.idUserLoan = u.idUser INNER JOIN position p ON p.idPosition = u.fk_idPosition WHERE l.status = 1 AND l.idUserLoan != 1 GROUP BY 1 ORDER BY l.idLoans`
	);
	let result = [];
	const admin = await valesModel.findByIdDate(1, date);
	let no = 1;
	if (admin.length > 0) {
		const loan = await db.query(
			`SELECT DISTINCT(l.idUserLoan), SUM(l.price) amount FROM loans l WHERE l.idUserLoan = ${admin[0].idUser} AND l.status = 1 AND date = '${date}'`
		);
		admin[0].price = helper.decimal(loan[0].amount);
		admin[0].no = no++;
		result.push(admin[0]);
	}
	for (const l of loans) {
		const loan = await db.query(
			`SELECT SUM(l.price) amount FROM loans l WHERE l.idUserLoan = ${l.idUser} AND l.status = 1`
		);
		l.price = helper.decimal(loan[0].amount);
		l.no = no++;
		result.push(l);
	}

	return result;
};

valesModel.findById = async (idLoan) => {
	const loan = await db.query(`SELECT * FROM loans WHERE idLoans = ${idLoan}`);
	return loan;
};

valesModel.findByIdUserIdLoan = async (idUser, idLoan) => {
	const loan = await db.query(
		`SELECT * FROM loans WHERE idLoans = ${idLoan} AND idUserLoan = ${idUser}`
	);
	return loan;
};

valesModel.findByIdAll = async (idUser) => {
	const loan = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY l.idLoans) no, l.* FROM loans l INNER JOIN user u ON l.idUserLoan = u.idUser WHERE idUserLoan = ${idUser} AND status = 1`
	);
	return loan;
};

valesModel.findByIdUser = async (idUser, date) => {
	const loan = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY l.idLoans) no, l.* FROM loans l INNER JOIN user u ON l.idUserLoan = u.idUser WHERE idUserLoan = ${idUser} AND status = 1 AND u.fk_idPosition != 1`
	);

	const loansAdmin = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY l.idLoans) no, l.* FROM loans l INNER JOIN user u ON l.idUserLoan = u.idUser WHERE idUserLoan = ${idUser} AND status = 1 AND u.fk_idPosition = 1 AND l.date = '${date}'`
	);

	for (const loAd of loansAdmin) loan.push(loAd);

	for (const l of loan) {
		l.price = helper.decimal(l.price);
		l.date = moment.date(l.date);
		const idUserRegistro = await turnoModel.findUserByidTurn(l.fk_idTurn);
		l.registro = (await userModel.findById(idUserRegistro))[0].name;
	}
	return loan;
};

valesModel.findByIdDate = async (idUser, date) => {
	const loans = await db.query(
		`SELECT u.idUser, CONCAT(u.name, ' - ', p.name) AS name FROM user u INNER JOIN loans l on l.idUserLoan = u.idUser INNER JOIN position p ON p.idPosition = u.fk_idPosition WHERE l.status = 1 AND u.fk_idPosition = 1 AND l.date = '${date}'`
	);
	return loans;
};

valesModel.findByIdDatePay = async (idUser, date) => {
	const loans = await db.query(
		`SELECT * FROM loans WHERE idUserLoan = ${idUser} and datePay = '${date}'`
	);
	return loans;
};

valesModel.findByIdDatePayPartial = async (idUser, dateFirst, dateLast) => {
	const loans = await db.query(
		`SELECT * FROM loans WHERE idUserLoan = ${idUser} and datePay BETWEEN '${dateFirst}' AND '${dateLast}'`
	);
	return loans;
};

valesModel.listEmp = async () => {
	const emp = await db.query(
		'SELECT user.idUser, user.name, position.name AS position FROM user INNER JOIN userlogin ON user.fk_idUserLogin = userlogin.idUserLogin INNER JOIN position ON user.fk_idPosition = position.idPosition WHERE userlogin.userStatus = 1'
	);
	return emp;
};

valesModel.insertLoan = async (idUserLoan, price, date, time, idTurn) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO loans (idLoans, price, date, time, idUserLoan, fk_idTurn) VALUES (NULL, '${price}', '${date}', '${time}', '${idUserLoan}', '${idTurn}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

valesModel.deleteLoan = async (idLoan) => {
	let result = false;
	try {
		await db.query(`UPDATE loans SET status = '0' WHERE idLoans = ${idLoan}`);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

valesModel.deleteLoanAll = async (idUser) => {
	let result = false;
	try {
		await db.query(
			`UPDATE loans SET status = '0' WHERE idUserLoan = ${idUser}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

valesModel.updateLoan = async (idLoan, price) => {
	let result = false;
	try {
		await db.query(
			`UPDATE loans SET price = '${price}' WHERE loans.idLoans = ${idLoan}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

valesModel.updateLoanPay = async (idLoan, date) => {
	let result = false;
	try {
		await db.query(
			`UPDATE loans SET status = '0', datePay = '${date}' WHERE loans.idLoans = ${idLoan}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

valesModel.updateLoanNoPay = async (idLoan) => {
	let result = false;
	try {
		await db.query(
			`UPDATE loans SET status = '1', datePay = NULL WHERE loans.idLoans = ${idLoan}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

valesModel.totalV = async () => {
	const total = await db.query(
		`SELECT SUM(price) AS total FROM loans WHERE status = 1`
	);
	return total[0].total;
};

valesModel.totalVales = async (date) => {
	const total = await db.query(
		`SELECT SUM(loans.price) as total FROM loans WHERE date = '${date}' AND status = 1`
	);
	return total[0].total;
};

valesModel.totalValesPartial = async (dateFirst, dateLast) => {
	const total = await db.query(
		`SELECT SUM(loans.price) as total FROM loans WHERE date BETWEEN '${dateFirst}' AND '${dateLast}' AND status = 1`
	);
	return total[0].total;
};

valesModel.totalVEmp = async (date) => {
	const total = await db.query(
		`SELECT (
			SELECT SUM(l.price) FROM loans l INNER JOIN user u ON u.idUser = l.idUserLoan WHERE l.status = 1 AND u.fk_idPosition != 1
		)  +  (
			SELECT COALESCE(SUM(l2.price), 0) FROM loans l2 INNER JOIN user u2 ON u2.idUser = l2.idUserLoan WHERE l2.date = '${date}' AND l2.status = 1 AND u2.fk_idPosition = 1
		) AS total FROM loans GROUP BY 1`
	);

	return total[0].total;
};

valesModel.totalUser = async (idUser, date) => {
	const result = [];

	const totalEmp = await db.query(
		`SELECT SUM(price) AS total FROM loans l INNER JOIN user u ON u.idUser = l.idUserLoan WHERE idUserLoan = ${idUser} AND status = 1 AND u.fk_idPosition != 1`
	);

	const totalAdmin = await db.query(
		`SELECT SUM(price) AS total FROM loans l INNER JOIN user u ON u.idUser = l.idUserLoan WHERE idUserLoan = ${idUser} AND status = 1 AND u.fk_idPosition = 1 AND l.date = '${date}'`
	);

	if (totalEmp[0].total) result.push(totalEmp[0]);
	else if (totalAdmin[0].total) result.push(totalAdmin[0]);

	return result[0].total;
};

module.exports = valesModel;
