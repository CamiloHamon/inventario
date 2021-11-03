const db = require('../database/connection');

const emp = {};

emp.listEmp = async () => {
	const emp = await db.query(
		'SELECT user.*, position.name AS positionName FROM user INNER JOIN position ON user.fk_idPosition = position.idPosition INNER JOIN userlogin ON user.fk_idUserLogin = userlogin.idUserLogin WHERE userlogin.userStatus = 1 AND user.rol = 0 ORDER BY user.idUser'
	);
	return emp;
};

emp.findByID = async (id) => {
	let emp = await db.query(
		`SELECT user.*, userlogin.username, position.idPosition, position.name AS namePosition FROM user INNER JOIN position ON user.fk_idPosition = position.idPosition INNER JOIN userlogin ON userlogin.idUserLogin = user.fk_idUserLogin WHERE user.rol = 0 AND user.idUser = ${id} AND user.idUser != 1`
	);
	if (emp.length > 0) emp = emp[0];
	return emp;
};

emp.findByUsername = async (username) => {
	const user = await db.query(
		`SELECT * FROM userlogin WHERE userlogin.username = '${username}'`
	);
	return user;
};

emp.valExist = async (id) => {
	let exist = false;

	try {
		const user = await db.query(
			`SELECT * FROM userlogin WHERE userlogin.idUserLogin = ${id} AND userlogin.userStatus = 1`
		);
		if (Object.keys(user).length > 0) {
			exist = true;
		}
	} catch (error) {
		console.log(error);
	}

	return exist;
};

emp.insert = async (user, name, position) => {
	const inUsLog = await db.query('INSERT INTO userlogin SET ?', [user]);
	const idUserCreate = inUsLog.insertId;
	const createUser = await db.query(
		`INSERT INTO user (idUser, name, imgProfile, rol, fk_idUserLogin, fk_idPosition) VALUES (${idUserCreate}, '${name}', NULL, '0', '${idUserCreate}', ${position})`
	);
	return createUser;
};

emp.imgProfileUser = async (id) => {
	const img = (
		await db.query(`SELECT user.imgProfile FROM user WHERE idUser = ${id}`)
	)[0].imgProfile;
	return img;
};

emp.delete = async (id) => {
	const delUser = await db.query(
		`UPDATE userlogin SET userStatus = '0' WHERE userlogin.idUserLogin = ${id} AND userlogin.idUserLogin != 1`
	);
	return true;
};

emp.updateImg = async (id, imgProfile) => {
	await db.query(
		`UPDATE user SET imgProfile = '${imgProfile}' WHERE user.idUser = ${id};`
	);
	return true;
};

emp.updateName = async (id, name) => {
	await db.query(`UPDATE user SET name = '${name}' WHERE user.idUser = ${id};`);
	return true;
};

emp.updatePosition = async (id, position) => {
	await db.query(
		`UPDATE user SET fk_idPosition = '${position}' WHERE user.idUser = ${id};`
	);
	return true;
};

emp.updateUsername = async (id, username) => {
	await db.query(
		`UPDATE userlogin SET username = '${username}' WHERE userlogin.idUserLogin = ${id};`
	);
	return true;
};

emp.updatePass = async (id, password) => {
	await db.query(
		`UPDATE userlogin SET password = '${password}' WHERE userlogin.idUserLogin = ${id};`
	);
	return true;
};

/* Position of employee*/

emp.listPosition = async () => {
	const position = await db.query(
		'SELECT * FROM position WHERE position.idPosition != 1'
	);
	return position;
};

emp.listNoPosition = async (idPosition) => {
	const noPosition = await db.query(
		`SELECT * FROM position WHERE position.idPosition != 1 AND position.idPosition != ${idPosition}`
	);
	return noPosition;
};

module.exports = emp;
