const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const conexion = mysql.createPool(database);

conexion.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('CONEXIÓN CON BASE DE DATOS PERDIDA');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('LA BASE DE DATOS TIENE MUCHAS CONEXIONES');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('CONEXIÓN RECHAZADA');
		}
	}

	if (connection) connection.release();
	console.log('BASE DE DATOS CONECTADA');
	return;
});

conexion.query = promisify(conexion.query);
module.exports = conexion;
