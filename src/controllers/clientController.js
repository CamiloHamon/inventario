const flMessage = require('../helpers/flash');
const clientModel = require('../models/clientModel');

const clientController = {};

clientController.clientView = async (req, res, next) => {
	const view = { clients: [], alert: [], error: [] };

	view.clients = await clientModel.list();

	const msg = flMessage.messages(req.flash());

	if (msg) {
		msg.type === 'info'
			? (view.alert = msg.message)
			: (view.error = msg.message);
	}

	res.render('pages/clientes/clientes', view);
};

clientController.clientList = async (req, res, next) => {
	let clients = await clientModel.list();
	clients = JSON.stringify(clients);
	res.send(clients);
};

clientController.clientAdd = (req, res, next) => {
	res.render('pages/clientes/clientes-agregar');
};

clientController.clientAddForm = async (req, res, next) => {
	const { name, complement } = req.body;

	const info = 'Cliente creado correctamente.',
		error = 'No se pudo crear el cliente.';

	const result = await clientModel.insert(name, complement);

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/clientes');
};

clientController.clientDelete = async (req, res, next) => {
	const id = req.params.id;

	const client = await clientModel.findById(id);
	const info = 'Cliente eliminado correctamente.',
		error = 'No se pudo eliminar el cliente.';

	let result = false;

	if (client.length > 0) result = await clientModel.delete(id);

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/clientes');
};

clientController.clientEdit = async (req, res, next) => {
	const view = { client: [] };
	const id = req.params.id;

	const client = await clientModel.findById(id);
	if (client.length > 0) view.client = client[0];
	else return res.redirect('/clientes');

	res.render('pages/clientes/clientes-editar', view);
};

clientController.clientEditForm = async (req, res, next) => {
	const id = req.params.id;
	const { name, complement } = req.body;

	const info = 'Cliente editado correctamente.',
		error = 'No se pudo editar el cliente.';

	let result = false;

	const client = await clientModel.findById(id);
	if (client.length > 0)
		result = await clientModel.update(id, name, complement);
	else return res.redirect('/clientes');

	result ? req.flash('info', info) : req.flash('error', error);

	res.redirect('/clientes');
};

module.exports = clientController;
