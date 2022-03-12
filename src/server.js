const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const MongoStore = require('connect-mongo')
const config = require('./config/config');

require('./database')
require('./passport/auth')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session(
    {
        store: MongoStore.create({ mongoUrl: config.MONGODB }),
        secret: config.SECRET,
        resave: false,
        saveUninitialized: false
    }
))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    app.locals.registerMessage = req.flash('registerMessage')
    app.locals.loginMessage = req.flash('loginMessage')
    next();
})
app.use(require('./routes'))

app.get('*', function(req, res) { 
    const auth = req.isAuthenticated()
    res.render('404', { auth });
});

module.exports = app;