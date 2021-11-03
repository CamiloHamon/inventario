const db = require('../database/connection');

const clientModel = {};

clientModel.list = async () => {
	const clients = await db.query('SELECT * FROM client WHERE status = 1');
	return clients;
};

clientModel.findById = async (idClient) => {
	const client = await db.query(
		`SELECT * FROM client WHERE status = 1 AND idClient = ${idClient}`
	);
	return client;
};

clientModel.insert = async (name, complement) => {
	let result = false;
	try {
		await db.query(
			`INSERT INTO client (idClient, name, complement, status) VALUES (NULL, '${name}', '${complement}', '1')`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}

	return result;
};

clientModel.delete = async (idClient) => {
	let result = false;
	try {
		await db.query(
			`UPDATE client SET status = 0 WHERE client.idClient = ${idClient}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

clientModel.update = async (idClient, name, complement) => {
	let result = false;
	try {
		await db.query(
			`UPDATE client SET name = '${name}', complement = '${complement}' WHERE client.idClient = ${idClient}`
		);
		result = true;
	} catch (error) {
		console.log(error);
	}
	return result;
};

module.exports = clientModel;
