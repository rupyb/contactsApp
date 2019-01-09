/* eslint-disable no-console */
/* global pool */

var debug = require('debug')('contacts:contacts');
var express = require('express');
var router = express.Router();

router.route('/')
    .get((req, res, next) => {
       
        pool.query('SELECT * FROM contacts', (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            // console.log(results);
            
            res.send(results.rows);
        });
    })
    .post((req, res, next) => {
        pool.query(`INSERT INTO contacts(firstname, lastname, phone, email) 
            VALUES($1, $2, $3, $4) RETURNING id`,
        [req.body.firstname, req.body.lastname, req.body.phone, req.body.email],
        (err, result) => {
            console.log(result.rows[0].id);
            
            if (err) {
                return res.status(500).send(err.message);
            }
            req.body.id = result.rows[0].id;
            res.status(201).send(JSON.stringify(req.body));
        });
    });
router.route('/:id')
    .delete ((req, res) => {
        pool.query('DELETE FROM contacts WHERE id=$1', [req.params.id], (err, deleteResults) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.status(200).send(deleteResults);
        });
    })
    .get((req, res, next) => {
        pool.query('SELECT * FROM contacts WHERE id=$1', [req.params.id], (err, results) => {
            console.log('entered get', results);
            //console.log('entered get', results.rows.length);
            if (err) {
                return res.status(500).send(err.message);
            }
            // console.log(results);
            if (!results.rows.length) {
                return res.status(404).send(`No contact with id ${req.params.id}`);
            }
            res.send(results.rows);
        });
    })
    .put((req, res) => {
        // console.log('entered put');
        // console.log('req.query',req.query);
        // console.log(' req.params', req.params);
        // console.log(' req.body', req.body);
        pool.query('UPDATE contacts SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE id = $5', 
            [req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.params.id], (err, results) => {
            // UPDATE contacts SET firstname = 'kim' WHERE id = 1
                if (err) {
                    return res.status(500).send(err.message);
                }
                // console.log(results);
                
                res.json(results);
            });
    });

module.exports = router;
