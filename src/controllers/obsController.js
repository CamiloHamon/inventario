const obsModel = require('../models/obsModel');
const flMessage = require('../helpers/flash');
const moment = require('../middlewares/moment');

const obsController = {};

obsController.delete = async (req, res, next) => {
	const { id, type } = req.params;
	const observation = await obsModel.findByIdDate(id, moment.toDay());

	const info = 'Observacion eliminada correctamente.',
		error = 'No se pudo eliminar la observacion.';

	let result = false;
	if (observation.length > 0) result = await obsModel.delete(id);

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect(`/turno/${type}`);
};

module.exports = obsController;
