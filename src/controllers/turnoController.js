const moment = require('../middlewares/moment');
const turnoModel = require('../models/turnoModel');
const cashBoxModel = require('../models/cashBoxModel');
const flMessage = require('../helpers/flash');
const endTurn = require('../helpers/endTurn');
require('dotenv').config();

const turnController = {};

turnController.turn = (req, res, next) => {
	const view = { alert: [], error: [] };
	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}
	//console.log(localStorage.getItem('turnos'));
	res.render('pages/caja/turnos', view);
};

turnController.turnForm = async (req, res, next) => {
	const currentTurns = JSON.parse(localStorage.getItem('turnos'));
	const idUser = req.user.idUser;
	let turn = '';

	if (currentTurns.length > 0) {
		if (currentTurns.length < 2) {
			if (currentTurns[0].idUser !== idUser) {
				if (currentTurns[0].idUser === 1) turn = await insertTurn(idUser);
				else if (req.user.rol === 1) turn = await insertTurn(idUser);
			}
		}
	} else {
		if(req.user.rol !== 1){
			const accountSid = process.env.ACCOUNT_SID; 
			const authToken = process.env.AUTH_TOKEN; 
			const client = require('twilio')(accountSid, authToken);
			client.messages 
				.create({ 
					body: `El empleado *${req.user.name}* ha iniciado turno.`, 
					from: 'whatsapp:+14155238886',       
					to: 'whatsapp:+573232390842' 
				}) 
				.then(message => console.log(message.sid)) 
				.done();
		}
		turn = await insertTurn(idUser);
	}

	if (turn) {
		currentTurns.push(turn);
		localStorage.setItem('turnos', JSON.stringify(currentTurns));
		req.flash('info', '¡Turno iniciado!');
		return res.redirect('/turno/caja');
	} else {
		req.flash(
			'error',
			'No puede iniciar turno porque otra persona esta haciendo el turno.'
		);
	}

	res.redirect('/turno');
};

turnController.terminar = async (req, res, next) => {
	const id = req.user.idUser;

	const info = 'Turno terminado.',
		error = 'No fue posible terminar el turno';

	const report = req.body.sendReport;
	if (report) {
		//envair
	}

	const end = await endTurn.end(id);

	if(req.user.rol !== 1){
		const accountSid = process.env.ACCOUNT_SID; 
		const authToken = process.env.AUTH_TOKEN; 
		const client = require('twilio')(accountSid, authToken);
		client.messages 
			.create({ 
				body: `El empleado *${req.user.name}* ha terninado turno.`, 
				from: 'whatsapp:+14155238886',       
				to: 'whatsapp:+573232390842' 
			}) 
			.then(message => console.log(message.sid)) 
			.done();
	}

	end ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/turno');
};

turnController.checkChashBox = async(req, res, next)=>{
	const date = moment.toDay();
	const cashToDay = await cashBoxModel.findByDate(date);
	const result = cashToDay.length > 0 ? false: true;
	return res.send(result);
}

turnController.saveChashBox = async(req, res, next)=>{
	const date = moment.toDay();
	const cashToDay = await cashBoxModel.findByDate(date);
	let result = false;
	if(!cashToDay.length > 0){
		const idUser = req.user.idUser, turn = await turnoModel.findByIdUser(idUser, date);
		if (turn.length >0) {
			const { price } = req.body;
			const insertCashBox = await cashBoxModel.insert(date, turn[0].idTurn, price);
			if(insertCashBox){
				result = true;
			}
		}
	}
	return res.send(result);
}

async function insertTurn(idUser) {
	const date = moment.toDay(),
		time = moment.currentTime();
	let turn = '';

	turn = await turnoModel.findByIdUser(idUser, date);

	if (turn.length === 0) {
		const insert = await turnoModel.insert(idUser, date, time);

		if (insert) {
			turn = {
				idUser,
				date,
				time,
				idTurn: insert.insertId,
			};
		}
	} else {
		turn = {
			idUser,
			date: moment.dateMYSQL(turn[0].date),
			time: turn[0].timeStart,
			idTurn: turn[0].idTurn,
		};
	}

	return turn;
}

module.exports = turnController;
