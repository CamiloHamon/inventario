const db = require('../database/connection');

const gastosModel = {};

gastosModel.listBills = async (date) => {
	const gastos = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY bills.date) no, bills.*, billsdetails.name FROM bills INNER JOIN billsdetails ON bills.fk_idBillsDetails = billsdetails.idbillsDetails WHERE date = '${date}'`
	);
	return gastos;
};

gastosModel.listBillsPeriod = async (dateFirst, dateLast) => {
	const gastos = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY bills.date) no, SUM(bills.price) as price, billsdetails.name FROM bills INNER JOIN billsdetails ON bills.fk_idBillsDetails = billsdetails.idbillsDetails WHERE date BETWEEN '${dateFirst}' AND '${dateLast}' GROUP BY bills.fk_idBillsDetails`
	);
	return gastos;
};

gastosModel.findById = async (idBill, date) => {
	const gasto = await db.query(
		`SELECT ROW_NUMBER() OVER(ORDER BY bills.date) no, bills.*, billsdetails.name FROM bills INNER JOIN billsdetails ON bills.fk_idBillsDetails = billsdetails.idbillsDetails WHERE date = '${date}' AND idBills = ${idBill}`
	);
	return gasto;
};

gastosModel.updateBill = async (idBill, idDetails, price) => {
	let result = false;

	try {
		await db.query(
			`UPDATE bills SET price = '${price}', fk_idBillsDetails = '${idDetails}' WHERE bills.idBills = ${idBill}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

gastosModel.deleteBill = async (idBill) => {
	let result = false;
	try {
		await db.query(`DELETE FROM bills WHERE bills.idBills = ${idBill}`);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

gastosModel.totalG = async (date) => {
	let total = await db.query(
		`SELECT SUM(price) as total FROM bills WHERE date = '${date}'`
	);
	total = total[0].total;
	return total;
};

gastosModel.totalGPartial = async (dateFirst, dateLast) => {
	let total = await db.query(
		`SELECT SUM(price) as total FROM bills WHERE date BETWEEN '${dateFirst}' AND '${dateLast}'`
	);
	total = total[0].total;
	return total;
};

gastosModel.insertBill = async (price, date, time, idTurn, idDetails) => {
	let result = false;

	try {
		await db.query(
			`INSERT INTO bills (idBills, price, date, time, fk_idTurn, fk_idBillsDetails) VALUES (NULL, '${price}', '${date}', '${time}', '${idTurn}', '${idDetails}')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

gastosModel.list = async () => {
	const list = await db.query('SELECT * FROM billsdetails');
	return list;
};

gastosModel.insertList = async (name) => {
	let result = false;

	try {
		result = await db.query(
			`INSERT INTO billsdetails (idbillsDetails, name) VALUES (NULL, '${name}')`
		);
	} catch (error) {
		console.log(error);
	}

	return result;
};

module.exports = gastosModel;
