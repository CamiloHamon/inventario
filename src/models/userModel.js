const db = require('../database/connection');

const userModel = {};

userModel.updateImg = async (id, imgProfile) => {
	await db.query(
		`UPDATE user SET imgProfile = '${imgProfile}' WHERE user.idUser = ${id};`
	);
	return true;
};

userModel.updateName = async (id, name) => {
	await db.query(`UPDATE user SET name = '${name}' WHERE user.idUser = ${id};`);
	return true;
};

userModel.updatePass = async (id, pass) => {
	await db.query(
		`UPDATE userlogin SET password = '${pass}' WHERE idUserLogin = ${id};`
	);
	return true;
};

userModel.findImage = async (id) => {
	const img = (
		await db.query(`SELECT user.imgProfile FROM user WHERE idUser = ${id}`)
	)[0].imgProfile;
	return img;
};

userModel.findPass = async (id) => {
	const pass = (
		await db.query(
			`SELECT userlogin.password FROM userlogin WHERE userlogin.idUserLogin = ${id}`
		)
	)[0].password;
	return pass;
};

userModel.valExist = async (id) => {
	let exist = false;

	try {
		const user = await db.query(
			`SELECT userlogin.* FROM userlogin INNER JOIN user ON userlogin.idUserLogin = user.fk_idUserLogin WHERE userlogin.idUserLogin = ${id} AND userlogin.userStatus = 1 AND user.rol = 1`
		);
		if (Object.keys(user).length > 0) {
			exist = true;
		}
	} catch (error) {
		console.log(error);
	}

	return exist;
};

userModel.findById = async (idUser) => {
	const user = await db.query(
		`SELECT * FROM user INNER JOIN userlogin on user.fk_idUserLogin = userlogin.idUserLogin WHERE userlogin.userStatus = 1 AND user.idUser = ${idUser}`
	);
	return user;
};

userModel.findByIdDetails = async (idUser) => {
	let emp = await db.query(
		`SELECT user.*, userlogin.username, position.idPosition, position.name AS namePosition FROM user INNER JOIN position ON user.fk_idPosition = position.idPosition INNER JOIN userlogin ON userlogin.idUserLogin = user.fk_idUserLogin WHERE user.idUser = ${idUser}`
	);
	if (emp.length > 0) emp = emp[0];
	return emp;
};

userModel.findPosition = async (idPosition) => {
	const position = await db.query(
		`SELECT position.name AS position FROM position WHERE idPosition = ${idPosition}`
	);
	return position;
};

userModel.findByIdPosition = async (idUser) => {
	const user = await db.query(
		`SELECT user.*, position.name AS position FROM user INNER JOIN position ON user.fk_idPosition = position.idPosition WHERE user.idUser = ${idUser}`
	);
	return user;
};

module.exports = userModel;
