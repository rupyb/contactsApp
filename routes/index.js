var debug = require('debug')('contacts:contacts');
var express = require('express');
var router = express.Router();

router.route('/')
    .get( function(req, res, next) {
        res.render('index', { title: 'Express', user: req.session.user ? req.session.user : 'noUser' });
    });


module.exports = router; 