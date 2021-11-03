const helpers = require('../helpers/helpers');
const moment = require('../middlewares/moment');
const misGastosModel = require('../models/misGastosModel');

const gastos = {};
function semanadelano($fecha) {
	$const = [2, 1, 7, 6, 5, 4, 3];
	// Constantes para el calculo del primer dia de la primera semana del año

	if ($fecha.match(/\//)) {
		$fecha = $fecha.replace(/\//g, '-', $fecha);
	}
	// Con lo anterior permitimos que la fecha pasada a la funcion este
	// separada por "/" al remplazarlas por "-" mediante .replace y el uso
	// de expresiones regulares

	$fecha = $fecha.split('-');
	// Partimos la fecha en trozos para obtener dia, mes y año por separado
	$dia = eval($fecha[0]);
	$mes = eval($fecha[1]);
	$ano = eval($fecha[2]);
	if ($mes != 0) {
		$mes--;
	}
	// Convertimos el mes a formato javascript 0=enero

	$dia_pri = new Date($ano, 0, 1);
	$dia_pri = $dia_pri.getDay();
	// Obtenemos el dia de la semana del 1 de enero
	$dia_pri = eval($const[$dia_pri]);
	// Obtenemos el valor de la constante correspondiente al día
	$tiempo0 = new Date($ano, 0, $dia_pri);
	// Establecemos la fecha del primer dia de la semana del año
	$dia = $dia + $dia_pri;
	// Sumamos el valor de la constante a la fecha ingresada para mantener
	// los lapsos de tiempo
	$tiempo1 = new Date($ano, $mes, $dia);
	// Obtenemos la fecha con la que operaremos
	$lapso = $tiempo1 - $tiempo0;
	// Restamos ambas fechas y obtenemos una marca de tiempo
	$semanas = Math.floor($lapso / 1000 / 60 / 60 / 24 / 7);
	// Dividimos la marca de tiempo para obtener el numero de semanas

	if ($dia_pri == 1) {
		$semanas++;
	}
	// Si el 1 de enero es lunes le sumamos 1 a la semana caso contrarios el
	// calculo nos daria 0 y nos presentaria la semana como semana 52 del
	// año anterior

	if ($semanas == 0) {
		$semanas = 52;
		$ano--;
	}
	// Establecemos que si el resultado de semanas es 0 lo cambie a 52 y
	// reste 1 al año esto funciona para todos los años en donde el 1 de
	// Enero no es Lunes

	if ($ano < 10) {
		$ano = '0' + $ano;
	}
	// Por pura estetica establecemos que si el año es menor de 10, aumente
	// un 0 por delante, esto para aquellos que ingresen formato de fecha
	// corto dd/mm/yy

	console.log($semanas + ' - ' + $ano);
	return $semanas;
	// Con esta sentencia arrojamos el resultado. Esta ultima linea puede ser
	// cambiada a gusto y conveniencia del lector
}

gastos.view = async (req, res, next) => {
	const view = {
		month: '',
		loans: [],
		loansPartial: [],
		loansPartialTwo: [],
		loansMonth: [],
		totalW: 0,
		totalPO: 0,
		totalPT: 0,
		totalM: 0,
	};

	const date = moment.toDay(),
		idUser = req.user.idUser;

	const firstDay = moment.dateMYSQL(calcfirstDay(date));
	const dayWeek = moment.dateMYSQL(calcDayWeek(date));
	const lastDayMonth = moment.dateMYSQL(calcLastDayMonth(date));

	let loansMonth = await misGastosModel.loans(firstDay, lastDayMonth, idUser); //week
	if (loansMonth.length > 0) {
		let loans = await misGastosModel.loans(firstDay, dayWeek, idUser);
		view.loans = completeInfo(loans);
		view.totalW = await misGastosModel.total(firstDay, dayWeek, idUser);

		//quincena 1
		const dayPartial = moment.dateMYSQL(calcDayPartial(date));

		let loansPartials = await misGastosModel.loans(
			firstDay,
			dayPartial,
			idUser
		);

		loansPartials = completeInfo(loansPartials);

		view.loansPartial = loansPartials;
		view.totalPO = await misGastosModel.total(firstDay, dayPartial, idUser);

		//mes
		loansMonth = completeInfo(loansMonth);

		view.loansMonth = loansMonth;
		view.totalM = await misGastosModel.total(firstDay, lastDayMonth, idUser);

		//quincena 2
		let loansPartialsTwo = await misGastosModel.loans(
			dayPartial,
			lastDayMonth,
			idUser
		);

		loansPartialsTwo = completeInfo(loansPartialsTwo);
		view.loansPartialsTwo = loansPartialsTwo;
		view.totalPT = await misGastosModel.total(dayPartial, lastDayMonth, idUser);

		view.totalM = helpers.decimal(view.totalM);
		view.totalPO = helpers.decimal(view.totalPO);
		view.totalPT = helpers.decimal(view.totalPT);
		view.totalW = helpers.decimal(view.totalW);
	}
	view.month = moment.month();

	res.render('pages/misGastos/mis-gastos-view.hbs', view);
};

function completeInfo(loans) {
	for (const l of loans) {
		l.price = helpers.decimal(l.price);
		l.date = moment.date(l.date);
		l.date = moment.formatData(l.date);
		l.time = moment.formatTime(l.time);
	}
	return loans;
}

async function calcDate(numberWeek, year) {
	const consult = `${year}${numberWeek}`;
	const day = (await misGastosModel.dayWeek(consult))[0].day;
	if (day) return moment.dateMYSQL(day);
	else return null;
}

async function calcDateLast(numberWeek, year) {
	const consult = `${year}${numberWeek}`;
	const day = (await misGastosModel.dayWeekLast(consult))[0].day;
	if (day) return moment.dateMYSQL(day);
	else return null;
}

function calcfirstDay(date) {
	const fecha = new Date(date),
		y = fecha.getFullYear(),
		m = fecha.getMonth();

	return new Date(y, m, 1);
}

function calcLastDayMonth(date) {
	const fecha = new Date(date),
		y = fecha.getFullYear(),
		m = fecha.getMonth();
	return new Date(y, m + 1, 0);
}

function calcDayWeek(date) {
	const fecha = new Date(date),
		y = fecha.getFullYear(),
		m = fecha.getMonth();

	return new Date(y, m, 7);
}

function calcDayPartial(date) {
	const fecha = new Date(date),
		y = fecha.getFullYear(),
		m = fecha.getMonth();

	return new Date(y, m, 15);
}

module.exports = gastos;
