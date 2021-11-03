module.exports = {
	isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		return res.redirect('/');
	},

	isNotLoggedIn(req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		return res.redirect('/turno');
	},

	isAdmin(req, res, next) {
		req.Admin = function () {
			return req.user.rol === 1 ? true : false;
		};
		if (req.Admin()) {
			return next();
		}

		return res.redirect('/turno');
	},

	currentTurn(req, res, next) {
		req.Turn = function () {
			const currentTurns = JSON.parse(localStorage.getItem('turnos'));
			let val = false;
			for (const i of currentTurns) {
				if (i.idUser === req.user.idUser) val = true;
			}
			return val;
		};

		if (req.Turn()) {
			return next();
		}

		return res.redirect('/turno');
	},

	notTurn(req, res, next) {
		req.Turn = function () {
			const currentTurns = JSON.parse(localStorage.getItem('turnos'));
			let val = true;
			for (const i of currentTurns) {
				if (i.idUser === req.user.idUser) val = false;
			}
			return val;
		};

		if (req.Turn()) {
			return next();
		}

		return res.redirect('/turno/caja');
	},
};
