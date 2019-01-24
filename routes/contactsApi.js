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
            res.send(results.rows);
        });
    })
    .post((req, res, next) => {
        pool.query(`INSERT INTO contacts(firstname, lastname, phone, email) 
            VALUES($1, $2, $3, $4) RETURNING id`,
        [req.body.firstname, req.body.lastname, req.body.phone, req.body.email],
        (err, result) => {
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
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!results.rows.length) {
                return res.status(404).send(`No contact with id ${req.params.id}`);
            }
            res.send(results.rows);
        });
    })
    .put((req, res) => {
        pool.query('UPDATE contacts SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE id = $5', 
            [req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.params.id], (err, results) => {
                if (err) {
                    return res.status(500).send(err.message);
                }
                
                res.json(results);
            });
    });

module.exports = router;
