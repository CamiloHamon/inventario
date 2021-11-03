const Moment = require('moment');
const momentTZ = require('moment-timezone');

Moment.locale('es');

const moment = {};

moment.toDay = () => {
	return momentTZ().tz('America/Bogota').format('YYYY-MM-DD');
};

moment.toCalcWeek = () => {
	return momentTZ().tz('America/Bogota').format('DD/MM/YYYY');
};

moment.anio = () => {
	return momentTZ().tz('America/Bogota').format('YYYY');
};

moment.month = () => {
	return momentTZ().tz('America/Bogota').format('MMMM');
};

moment.day = () => {
	return momentTZ().tz('America/Bogota').format('DD');
};

moment.getMonth = () => {
	return momentTZ().tz('America/Bogota').format('MM');
};

moment.getYear = () => {
	return momentTZ().tz('America/Bogota').format('YYYY');
};

moment.date = (date) => {
	return Moment(date).format('DD/MM/YYYY');
};

moment.dateMYSQL = (date) => {
	return Moment(date).format('YYYY-MM-DD');
};

moment.currentTime = () => {
	return (currentTime = momentTZ().tz('America/Bogota').format('hh:mm:ss'));
};

moment.formatData = (date) => {
	const dateParts = date.split('/');
	const newDate = new Date(
		dateParts[2].substr(0, 2),
		dateParts[1] - 1,
		dateParts[0]
	);

	return Moment(newDate).format('DD/MM');
};

moment.formatTime = (time) => {
	const dateParts = time.split(':');

	return Moment().format(`${dateParts[0]}:${dateParts[1]}`);
};

module.exports = moment;
