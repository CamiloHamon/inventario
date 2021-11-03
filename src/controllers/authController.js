const passport = require('passport');
const endTurn = require('../helpers/endTurn');

const controller = {};

controller.renderLogin = (req, res) => {
	res.render('pages/login/login');
};

controller.signin = (req, res, next) => {
	passport.authenticate('local-signin', {
		successRedirect: '/turno',
		failureRedirect: '/',
		failureFlash: true,
	})(req, res, next);
};

controller.renderSignup = (req, res) => {
	res.render('signup/signup');
};

controller.signup = passport.authenticate('local-signup', {
	successRedirect: '/turno',
	failureRedirect: '/',
	failureFlash: true,
});

controller.logout = async (req, res, next) => {
	await endTurn.end(req.user.idUser);
	req.logOut();
	res.redirect('/');
};

module.exports = controller;
