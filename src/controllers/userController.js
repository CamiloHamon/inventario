const userModel = require('../models/userModel');
const mgImages = require('../helpers/manageImages');
const encrypt = require('../helpers/encypt');

const userController = {};

userController.view = (req, res, next) => {
	const view = { alert: [], error: [] };

	let msg = req.flash('info');

	if (msg.length > 0) {
		view.alert = msg;
	}

	msg = req.flash('error');
	if (msg.length > 0) {
		view.error = msg;
	}
	res.render('pages/account/account', view);
};

userController.updateImg = async (req, res, next) => {
	const id = req.params.id;
	if (await userModel.valExist(id)) {
		if (req.file) {
			const currentImg = await userModel.findImage(id);
			if (currentImg) {
				const delteImg = await mgImages.delete(currentImg);
			}
			const imgProfile = await mgImages.move(req.file);
			const updateImg = await userModel.updateImg(id, imgProfile);
			updateImg
				? req.flash('info', 'Imagen actualizada.')
				: req.flash('error', 'No se pudo actualizar la imagen');
		} else {
			req.flash('error', 'No se pudo actualizar la imagen');
			return;
		}
	} else {
		req.flash('error', 'No se pudo actualizar la imagen');
		return;
	}

	res.redirect('/cuenta');
};

userController.showName = async (req, res, next) => {
	const id = 1;
	const user = await userModel.findById(id);
	if (user.length > 0) {
		return res.send(JSON.stringify([{ img: true, url: user[0].imgProfile }]));
	}
	res.redirect('/cuenta');
};

userController.updateName = async (req, res, next) => {
	const id = req.params.id,
		name = req.body.name;

	if (await userModel.valExist(id)) {
		const updateName = userModel.updateName(id, name);
		updateName
			? req.flash('info', 'Nombre actualizado.')
			: req.flash(
					'error',
					'No se pudo actualizar el nombre. Intentelo de nuevo.'
			  );
	} else {
		res.status(404).redirect('/error');
		return;
	}
	res.redirect(`/cuenta`);
};

userController.updatePass = async (req, res, next) => {
	const id = req.params.id;
	let { currentPass, password } = req.body;
	if (await userModel.valExist(id)) {
		const pass = await userModel.findPass(id);
		const validPassword = await encrypt.matchPassword(currentPass, pass);
		if (validPassword) {
			password = await encrypt.encryptPassword(password);
			const change = await userModel.updatePass(id, password);
			change
				? req.flash('info', 'Contraseña actualizada.')
				: req.flash(
						'error',
						'No se pudo actualizar la contraseña. Intentelo de nuevo.'
				  );
		} else {
			req.flash('error', 'La contraseña actual es incorrecta.');
		}
	} else {
		res.status(404).redirect('/error');
		return;
	}
	res.redirect(`/cuenta`);
};

module.exports = userController;
