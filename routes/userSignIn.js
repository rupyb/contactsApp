/* eslint-disable no-console */
/* global pool */

var debug = require('debug')('contacts:contacts');
var express = require('express');
var router = express.Router();

router.route('/')
    .post((req, res, next) => {
        const { email, password } = req.body;
        if(email && password) {
            pool.query(`SELECT * 
                        FROM users
                        WHERE email = $1 
                        AND password = crypt($2, password);`, 
            [email, password], (err, queryResults) => {
                if (err) {
                    return res.status(500).send(err.message);
                }
                if(!queryResults.rows[0]) {
                    res.status(400).send('Email or Password is Incorrect!');
                }
                req.session.user = queryResults.rows[0];
                
                res.status(200).send(queryResults.rows[0]);
            });
        } else {
            res.status(401).send('Unauthorized Admin Password Incorrect!');
        }
    })
    .get((req, res, next) => {
        res.end();
    });


module.exports = router; 