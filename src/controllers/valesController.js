const flMessage = require('../helpers/flash');
const valModel = require('../models/valModel');
const userModel = require('../models/userModel');
const moment = require('../middlewares/moment');
const turnHelper = require('../helpers/turn');
const helpers = require('../helpers/helpers');
const emp = require('../models/empModel');

const valesController = {};

valesController.valesView = async (req, res, next) => {
	const view = { loans: [], alert: [], error: [] };

	const date = moment.toDay();
	view.loans = await valModel.listCurrentLoansEmp(date);

	const totalV = await valModel.totalVEmp(date);
	view.totalV = helpers.decimal(totalV);

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/caja/turno-vales', view);
};

valesController.valesDetails = async (req, res, next) => {
	const view = { userLoan: [], loans: [], totalV: '', alert: [], error: [] };

	const id = Number(req.params.id);

	if (!isNaN(id)) {
		const date = moment.toDay();
		// validar que si tenga vales
		const loans = await valModel.findByIdUser(id, date);
		//console.log(loans.length);
		if (loans.length > 0) {
			view.userLoan = await userModel.findByIdDetails(id);
			for (const loan of loans) {
				loan.date = moment.formatData(loan.date);
				loan.time = moment.formatTime(loan.time);
			}
			view.loans = loans;
			let totalV = await valModel.totalUser(id, date);
			view.totalV = helpers.decimal(totalV);
			return res.render('pages/caja/turno-vales-ver', view);
		} else return;
	}

	const msg = flMessage.messages(req.flash());
	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.redirect('/turno/vales');

	//res.render('pages/caja/turno-vales-ver', view);
};

valesController.addLoan = async (req, res, next) => {
	const view = { empl: [] };
	view.empl = await valModel.listEmp();
	res.render('pages/caja/turno-vales-agregar', view);
};

valesController.addLoanForm = async (req, res, next) => {
	let { user, price } = req.body;

	let insertVal = false;
	const info = 'Vale registrado correctamente.',
		error = 'No se ha registrado el vale.';

	const isUser = await userModel.findById(user);
	if (isUser.length > 0) {
		price = parseFloat(price);
		if (!isNaN(price)) {
			const date = moment.toDay(),
				time = moment.currentTime(),
				idTurn = turnHelper.idTurn(req.user.idUser);
			insertVal = await valModel.insertLoan(user, price, date, time, idTurn);
		}
	}

	insertVal ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/vales');
};

valesController.deleteLoan = async (req, res, next) => {
	const id = req.params.id;

	let result = false;
	const info = 'Vale eliminado correctamente.',
		error = 'No se ha eliminado el vale.';

	const loan = await valModel.findById(id);
	if (loan.length > 0) result = await valModel.deleteLoan(id);

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/vales');
};

valesController.deleteLoanAll = async (req, res, next) => {
	const id = req.params.id;

	let result = false;
	const info = 'Vales eliminado correctamente.',
		error = 'No se ha eliminado los vales.';

	const loan = await valModel.findByIdAll(id);
	if (loan.length > 0) result = await valModel.deleteLoanAll(id);

	result ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/vales');
};

valesController.editLoan = async (req, res, next) => {
	const view = { loan: [], empl: [] };
	const id = req.params.id;
	const loan = await valModel.findById(id);
	if (loan.length > 0) {
		view.loan = loan[0];
		const userLoan = await userModel.findByIdPosition(view.loan.idUserLoan);
		view.empl = userLoan[0];
		return res.render('pages/caja/turno-vales-editar', view);
	}
	res.redirect('/turno/vales');
};

valesController.editLoanForm = async (req, res, next) => {
	let updateVal = false;
	const info = 'Vale actualizado correctamente.',
		error = 'No se ha actualizado el vale.';

	let { price } = req.body;

	const id = req.params.id;
	const loan = await valModel.findById(id);

	if (loan.length > 0) {
		price = parseFloat(price);
		if (!isNaN(price)) {
			updateVal = await valModel.updateLoan(id, price);
		}
	}

	updateVal ? req.flash('info', info) : req.flash('error', error);
	res.redirect('/turno/vales');
};

valesController.listLoans = async (req, res, next) => {
	const id = Number(req.params.id);
	if (!isNaN(id)) {
		const userLoan = await userModel.findById(id);
		if (userLoan.length > 0) {
			const loans = await valModel.findByIdUser(id);
			if (loans.length > 0) return res.send(JSON.stringify(loans));
			else return res.json(false);
		}
	}

	return res.json('error');
};

valesController.delValPay = async (req, res, next) => {
	const { idUser, idLoan } = req.body;
	const infoUser = await userModel.findById(idUser);
	let result = false;
	if (infoUser.length > 0) {
		const valLoan = await valModel.findByIdUserIdLoan(idUser, idLoan);
		if (valLoan.length > 0) result = await valModel.updateLoanNoPay(idLoan);
	}

	result ? res.send(true) : res.send(false);
};

module.exports = valesController;
