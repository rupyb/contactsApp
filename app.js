var debug = require('debug')('contacts:app');
var createError = require('http-errors');
var express = require('express');
var path = require('path');

var logger = require('morgan');
const session = require('express-session');

var contactsApiRouter = require('./routes/contactsApi');
var userSignUp = require('./routes/userSignUp');
var userSignIn = require('./routes/userSignIn');
var index = require('./routes/index');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'mySecret',
    cookie: {
        maxAge: 100000
    },
    resave: false,
    saveUninitialized: false
}));
app.use('/isSignedIn',(req, res, next) => {
    let response = req.session.user ? req.session.user : null;
    res.send(response);
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',index);
app.use('/userSignUp',userSignUp);
app.use('/userSignIn',userSignIn);
app.use('/api/contacts', contactsApiRouter);
app.use('/logOut',(req, res, next) => {
    req.session.destroy();
    res.end('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

app.locals.appTitle = 'PCS Contacts APP';


const { Pool } = require('pg');

const connectionString = 'postgres://pbmiaedlsmwwuh:b7aa2a0306173fcb552a966ae02fe25614b78b37757540235146fe49979a1fff@ec2-174-129-18-247.compute-1.amazonaws.com:5432/d26ec1soo2b8o';

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
});

// pool.query('SELECT * from contacts', (err, res) => {
// });

global.pool = pool;


debug('App initialized');
module.exports = app;
