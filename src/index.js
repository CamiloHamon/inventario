const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { database } = require('./database/keys');
const passport = require('passport');
const { LocalStorage } = require('node-localstorage');
//inicialization
const app = express();
require('./lib/passport/local-auth');

//settings
app.set('appName', 'Inventario');
app.set('port', process.env.PORT || 3100);
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'main',
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
	})
);
app.set('view engine', '.hbs');

/* Middlewares */

app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: 'faztmysqlnodemysql',
		resave: false,
		saveUninitialized: false,
		store: new MySQLStore(database),
	})
);

localStorage = new LocalStorage(path.join(__dirname, '_aux'));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
	app.locals.success = req.flash('success');
	app.locals.message = req.flash('message');
	app.locals.user = req.user;
	next();
});

//routes
app.use(require('./routes/login'));
app.use(require('./routes/turno'));
app.use(require('./routes/inventario'));
app.use(require('./routes/empleados'));
app.use(require('./routes/reportes'));
app.use(require('./routes/account'));
app.use(require('./routes/clientes'));
app.use(require('./routes/mis-gastos'));
app.use(require('./routes/signup'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//error 404
app.use(require('./routes/error'));

//starting the server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
});
