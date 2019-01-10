/* eslint-disable no-console */
/* global pool */

var debug = require('debug')('contacts:contacts');
var express = require('express');
var router = express.Router();

router.route('/')
    .post((req, res, next) => {
        console.log('-----------------------------');
        const { firstname, lastname, email, password, adminPassword } = req.body;
        if(adminPassword === '1234' && firstname && lastname && password) {
            console.log('entered if----------------------------------------');
            // eslint-disable-next-line quotes
            pool.query(`INSERT INTO users (firstname, lastname, email, password) 
            VALUES ($1, $2, $3,crypt($4, gen_salt('bf'))) RETURNING firstname`, 
            [firstname, lastname, email, password], (err, queryResults) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).send(err.message);
                }
                res.status(200).send(queryResults.rows[0]);
            });
        } else {
            res.status(401).send('Unauthorized Admin Password Incorrect!');
        }
        
        //res.end();
    })
    .get((req, res, next) => {
        res.end();
    });


module.exports = router; 
