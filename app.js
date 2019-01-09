var debug = require('debug')('contacts:app');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var contactsApiRouter = require('./routes/contactsApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/',);
app.use('/api/contacts', contactsApiRouter);


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


const { Pool, Client } = require('pg');

const connectionString = 'postgres://pbmiaedlsmwwuh:b7aa2a0306173fcb552a966ae02fe25614b78b37757540235146fe49979a1fff@ec2-174-129-18-247.compute-1.amazonaws.com:5432/d26ec1soo2b8o';

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
});

pool.query('SELECT * from contacts', (err, res) => {
    // console.log(err, res.rows);
    // pool.end();
});

const client = new Client({
    connectionString: connectionString,
    ssl: true,
});
  
// eslint-disable-next-line quotes
pool.query("UPDATE contacts SET lastname = 'dill' WHERE firstname = 'john'", (err, res) => {
    // console.log('errorrrrrrrrrrrrrrrrrrrrrrrrr', err);   
    // console.log(res);
});

global.pool = pool;

debug('App initialized');
module.exports = app;
