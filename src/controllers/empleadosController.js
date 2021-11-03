/** @format */

const empModel = require('../models/empModel');
const mgImages = require('../helpers/manageImages');
const encryp = require('../helpers/encypt');

const controllerEmp = {};

controllerEmp.list = async (req, res, next) => {
	const view = { emp: [], alert: [] };
	view.emp = await empModel.listEmp();

	const msg = req.flash('info');

	if (msg.length > 0) {
		view.alert = msg;
	}

	res.render('pages/empleados/empleados', view);
};

controllerEmp.imgProfile = async (req, res, next) => {
	const id = req.params.id;
	let emp = [];

	if (await empModel.valExist(id)) {
		const empleado = await empModel.findByID(id);

		if (empleado.imgProfile) emp.push({ img: true, url: empleado.imgProfile });
		else emp.push({ img: false, url: 'profile.png' });
	}
	res.send(JSON.stringify(emp));
};

controllerEmp.insertView = async (req, res, next) => {
	const view = { position: [], error: [] };
	view.position = await empModel.listPosition();

	const msg = req.flash('error');

	if (msg.length > 0) {
		view.error = msg;
	}

	res.render('pages/empleados/empleados-agregar', view);
};

controllerEmp.insert = async (req, res, next) => {
	const { name, position, username, password } = req.body;
	const userVal = await empModel.findByUsername(username);
	if (userVal.length === 0) {
		const newUser = { username, password };
		newUser.password = await encryp.encryptPassword(password);
		const userCreate = await empModel.insert(newUser, name, position);
		if (req.file) {
			const imgProfile = await mgImages.move(req.file);
			const updateImg = await empModel.updateImg(
				userCreate.insertId,
				imgProfile
			);
		}
	} else {
		req.flash('error', `El empleado: ${name} ya existe.`);
		res.redirect('/empleados/agregar');
		return;
	}

	req.flash('info', `Empleado creado: ${name}.`);

	res.redirect('/empleados');
};

controllerEmp.edit = async (req, res, next) => {
	const id = req.params.id;
	const view = { emp: [], position: [], alert: [], error: [] };

	if (await empModel.valExist(id)) {
		view.emp = await empModel.findByID(id);
		view.position = await empModel.listNoPosition(view.emp.fk_idPosition);

		let msg = req.flash('info');

		if (msg.length > 0) {
			view.alert = msg;
		}

		msg = req.flash('error');
		if (msg.length > 0) {
			view.error = msg;
		}

		res.render('pages/empleados/empleados-editar', view);
	} else {
		res.status(404).redirect('/error');
	}
};

controllerEmp.delete = async (req, res, next) => {
	const id = req.params.id;
	if (await empModel.valExist(id)) {
		await empModel.delete(id);
		req.flash('info', 'El usuario ha sido eliminado.');
		res.redirect(`/empleados`);
		return;
	}
	res.status(404).redirect('/error');
};

controllerEmp.updateImg = async (req, res, next) => {
	const id = req.params.id;

	if (await empModel.valExist(id)) {
		if (req.file) {
			const imgUser = await empModel.imgProfileUser(id);
			if (imgUser) {
				const deleteImg = await mgImages.delete(imgUser);
			}

			const imgProfile = await mgImages.move(req.file);
			const updateImg = await empModel.updateImg(id, imgProfile);

			updateImg
				? req.flash('info', 'Imagen actualizada.')
				: req.flash('error', 'No se pudo actualizar la imagen');
		} else {
			req.flash('error', 'No se pudo actualizar la imagen');
		}
	} else {
		res.status(404).redirect('/error');
	}
	res.redirect(`/empleados/editar/${id}`);
};

controllerEmp.updateName = async (req, res, next) => {
	const name = req.body.name,
		id = req.params.id;

	if (await empModel.valExist(id)) {
		const updateName = empModel.updateName(id, name);
		if (updateName) {
			req.flash('info', 'Nombre actualizado.');
			res.redirect(`/empleados/editar/${id}`);
			return;
		} else {
			req.flash(
				'error',
				'No se pudo actualizar el nombre. Intentelo de nuevo.'
			);
			res.redirect(`/empleados/editar/${id}`);
			return;
		}
	}

	res.status(404).redirect('/error');
	return;
};

controllerEmp.updatePosition = async (req, res, next) => {
	const position = req.body.position,
		id = req.params.id;

	if (await empModel.valExist(id)) {
		const updatePosition = await empModel.updatePosition(id, position);
		if (updatePosition) {
			req.flash('info', 'Cargo actualizado.');
			res.redirect(`/empleados/editar/${id}`);
			return;
		} else {
			req.flash('error', 'No se pudo actualizar el cargo. Intentelo de nuevo.');
			res.redirect(`/empleados/editar/${id}`);
			return;
		}
	}

	res.status(404).redirect('/error');
	return;
};

controllerEmp.updateUsername = async (req, res, next) => {
	const username = req.body.username,
		id = req.params.id;

	if (await empModel.valExist(id)) {
		const valUserName = await empModel.findByUsername(username);
		if (valUserName.length === 0) {
			const updateUsername = await empModel.updateUsername(id, username);
			if (updateUsername) {
				req.flash('info', 'Nombre de usuario actualizado.');
				res.redirect(`/empleados/editar/${id}`);
				return;
			} else {
				req.flash(
					'error',
					'No se pudo actualizar el nombre de usuario. Intentelo de nuevo.'
				);
				res.redirect(`/empleados/editar/${id}`);
				return;
			}
		} else {
			req.flash(
				'error',
				`El nombre de usuario: ${username} ya existe. Intente con otro.`
			);
			res.redirect(`/empleados/editar/${id}`);
			return;
		}
	}

	res.status(404).redirect('/error');
	return;
};

controllerEmp.updatePass = async (req, res, next) => {
	let password = req.body.password;
	const id = req.params.id;

	if (await empModel.valExist(id)) {
		password = await encryp.encryptPassword(password);
		const updatePass = await empModel.updatePass(id, password);
		if (updatePass) {
			req.flash('info', 'Contraseña del empleado actualizada.');
			res.redirect(`/empleados/editar/${id}`);
			return;
		} else {
			req.flash(
				'error',
				'No se pudo actualizar la contraseña. Intentelo de nuevo.'
			);
			res.redirect(`/empleados/editar/${id}`);
			return;
		}
	}

	res.status(404).redirect('/error');
	return;
};

module.exports = controllerEmp;
