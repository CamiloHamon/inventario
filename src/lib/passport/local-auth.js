const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../database/connection');
const encryp = require('../../helpers/encypt');

passport.use(
	'local-signup',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			const name = req.body.name;

			const newUser = {
				username,
				password,
			};

			newUser.password = await encryp.encryptPassword(password);

			const result = await db.query('INSERT INTO userlogin SET ?', [newUser]);
			const idUserCreate = result.insertId;
			newUser.idUserLogin = idUserCreate;

			const createUser = await db.query(
				`INSERT INTO user (idUser, name, imgProfile, rol, fk_idUserLogin, fk_idPosition) VALUES (${idUserCreate}, '${name}', NULL, '0', '${idUserCreate}', '1')`
			);

			return done(null, newUser);
		}
	)
);

passport.use(
	'local-signin',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			const rows = await db.query(
				`SELECT * FROM userlogin WHERE userlogin.username = '${username}' AND userlogin.userStatus = '1'`
			);
			if (rows.length > 0) {
				const user = rows[0];
				const validPassword = await encryp.matchPassword(
					password,
					user.password
				);
				if (validPassword) {
					const username = (
						await db.query(
							`SELECT * FROM user WHERE user.idUser = ${user.idUserLogin}`
						)
					)[0];
					done(null, user, req.flash('success', 'Bienvenid@ ' + username.name));
				} else {
					done(null, false, req.flash('message', 'Contraseña incorrecta.'));
				}
			} else {
				return done(
					null,
					false,
					req.flash('message', 'Nombre de usuario incorrecto.')
				);
			}
		}
	)
);

//serealizable

passport.serializeUser((user, done) => {
	done(null, user.idUserLogin);
});

passport.deserializeUser(async (id, done) => {
	const rows = await db.query(
		'SELECT user.idUser, user.name, user.imgProfile, user.rol FROM userlogin INNER JOIN user ON userlogin.idUserLogin = user.fk_idUserLogin WHERE userlogin.idUserLogin = ?',
		[id]
	);
	done(null, rows[0]);
});
