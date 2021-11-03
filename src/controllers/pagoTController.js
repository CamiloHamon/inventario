const moment = require('../middlewares/moment');
const flMessage = require('../helpers/flash');
const pagoModel = require('../models/pagoModel');
const userModel = require('../models/userModel');
const empModel = require('../models/empModel');
const helpers = require('../helpers/helpers');
const turnHelper = require('../helpers/turn');
const valesModel = require('../models/valModel');

const pagoTController = {};

pagoTController.payView = async (req, res, next) => {
	const view = { pays: [], totalP: '', alert: [], error: [], disable: false };

	const date = moment.toDay();
	const pays = await pagoModel.listPago(date);
	view.pays = await completePay(pays);
	const totalP = await pagoModel.totalP(date);
	view.totalP = helpers.decimal(totalP[0].total);

	view.disable = await valPayTurn(pays);

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-pagos', view);
};

pagoTController.addPay = async (req, res, next) => {
	const view = { empl: [] };
	const date = moment.toDay();

	const pays = await pagoModel.listPago(date);
	const valMaxPay = await valPayTurn(pays);
	if (!valMaxPay) {
		const pagados = await pagoModel.listPago(date);
		view.empl = await emplNoPay(pagados);
	} else return res.redirect('/turno/pago');

	res.render('pages/caja/turno-pagos-agregar', view);
};

pagoTController.addPayForm = async (req, res, next) => {
	const { idUser, amount, loans } = req.body;

	let result = false,
		cambio = 0;

	const info = 'Pago registrado correctamente.',
		error = 'No se pudo registrar el pago.';

	const infoUser = await userModel.findById(idUser);
	if (infoUser.length > 0) {
		if (loans.length > 0) {
			let val = false;
			for (let i = 0; i < loans.length; i++) {
				const valLoan = await valesModel.findByIdUserIdLoan(idUser, loans[i]);
				if (valLoan.length > 0) {
					val = true;
					cambio += Number(valLoan[0].price);
				} else {
					val = false;
					break;
				}
			}

			if (!val) {
				const mess = {
					state: false,
					message: 'Alguno de los vales no corresponden al usuario.',
				};
				req.flash('error', error);
				return res.send(mess);
			} else {
				const date = moment.toDay();
				//update vales
				for (const l of loans) await valesModel.updateLoanPay(l, date);

				result = addPay(idUser, req.user.idUser, amount);

				if (result) {
					let vueltas = 0,
						price = Number(amount);
					if (cambio > price) vueltas = cambio - price;
					else vueltas = price - cambio;

					const rta = {
						status: true,
						details: { amount, totalVales: cambio, vueltas },
					};
					req.flash('info', info);
					return res.send(rta);
				} else {
					const mess = {
						state: false,
						message: 'El vale no corresponde al usuario.',
					};
					req.flash('error', error);
					return res.send(mess);
				}
			}
		} else {
			result = addPay(idUser, req.user.idUser, amount);
			if (result) {
				req.flash('info', info);
				return res.send({
					status: true,
					type: 'onlyPay',
				});
			} else {
				req.flash('error', error);
				return res.send({
					status: false,
					message: 'Ocurrio un error.',
				});
			}
		}
	} else {
		req.flash('error', error);
		return res.send({
			status: false,
			message: 'El usuario no existe.',
		});
	}

	/*let result = false;
	const info = 'Pago registrado correctamente.',
		error = 'No se pudo registrar el pago.';

	const date = moment.toDay();
	const pays = await pagoModel.listPago(date);
	const valMaxPay = await valPayTurn(pays);
	if (!valMaxPay) {
		const isPayed = await pagoModel.findByIdDate(user, date);
		if (isPayed.length === 0) {
			const time = moment.currentTime();
			const turnId = turnHelper.idTurn(req.user.idUser);
			result = await pagoModel.insertPay(user, price, date, time, turnId);
		}
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/pago');*/
};

async function addPay(idUser, currentUser, amount) {
	let result = false;
	const date = moment.toDay();
	const pays = await pagoModel.listPago(date);
	const valMaxPay = await valPayTurn(pays);
	if (!valMaxPay) {
		const isPayed = await pagoModel.findByIdDate(idUser, date);
		if (isPayed.length === 0) {
			const time = moment.currentTime();
			const turnId = turnHelper.idTurn(currentUser);
			result = await pagoModel.insertPay(idUser, amount, date, time, turnId);
		}
	}
	return result;
}

pagoTController.editPay = async (req, res, next) => {
	const view = { turn: [], empl: [], loans: [] };
	const id = req.params.id;

	const date = moment.toDay();
	const isPayed = await pagoModel.findByTurnDate(id, date);
	if (isPayed.length > 0) {
		view.turn = isPayed[0];
		const empl = await userModel.findByIdPosition(view.turn.idUserPayTurn);
		view.empl = empl[0];
		view.loans = await valesModel.findByIdDatePay(view.empl.idUser, date);
		for (const l of view.loans) {
			l.date = moment.date(l.date);
			l.price = helpers.decimal(l.price);
		}
	} else return res.redirect('/turno/pago');

	res.render('pages/caja/turno-pagos-editar', view);
};

pagoTController.editPayForm = async (req, res, next) => {
	let { price } = req.body;
	const id = req.params.id;
	const date = moment.toDay();
	const isPayed = await pagoModel.findByTurnDate(id, date);

	let result = false;
	const info = 'Pago actualizado correctamente.',
		error = 'No se pudo actualizar el pago.';

	if (isPayed.length > 0) {
		price = parseFloat(price);
		if (!isNaN(price)) result = await pagoModel.updatePay(id, price);
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/pago');
};

pagoTController.deletePay = async (req, res, next) => {
	const id = req.params.id;
	const date = moment.toDay();
	const isPayed = await pagoModel.findByTurnDate(id, date);

	let result = false;
	const info = 'Pago eliminado correctamente.',
		error = 'No se pudo eliminar el pago.';

	if (isPayed.length > 0) {
		console.log(isPayed[0].idUserPayTurn);
		const loans = await valesModel.findByIdDatePay(
			isPayed[0].idUserPayTurn,
			date
		);

		for (const l of loans) await valesModel.updateLoanNoPay(l.idLoans);

		result = await pagoModel.deletePay(id);
	}

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/pago');
};

async function emplNoPay(pagados) {
	const empl = await empModel.listEmp();

	for (let i = 0; i < pagados.length; i++) {
		for (let j = 0; j < empl.length; j++) {
			if (pagados[i].idUserPayTurn === empl[j].idUser) {
				empl.splice(j, 1);
				j = empl.length;
			}
		}
	}

	return empl;
}

async function completePay(pays) {
	for (const p of pays) {
		let userPay = await userModel.findByIdPosition(p.idUserPayTurn);
		userPay = userPay[0];
		p.name = userPay.name;
		p.imgProfile = userPay.imgProfile;
		p.position = userPay.position;
		p.price = helpers.decimal(p.price);
	}

	return pays;
}

async function valPayTurn(paysTurns) {
	let result = false;
	const empl = await empModel.listEmp();
	if (paysTurns.length === empl.length) result = true;
	return result;
}

module.exports = pagoTController;
