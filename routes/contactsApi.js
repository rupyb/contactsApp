/* eslint-disable no-console */
/* global db */

var debug = require('debug')('contacts:contacts');
var express = require('express');
var router = express.Router();

router.route('/')
    .get((req, res, next) => {
        db.query('SELECT * FROM contacts', (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            // console.log(results);
            
            res.send(results);
        });
    })
    .post((req, res, next) => {
        db.query(`INSERT INTO contacts(firstname, lastname, phone, email) 
            VALUES(?, ?, ?, ?)`,
        [req.body.firstname, req.body.lastname, req.body.phone, req.body.email],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            req.body.id = result.insertId;
            res.status(201).send(JSON.stringify(req.body));
        });
    });
router.route('/:id')
    .delete ((req, res) => {
        db.query('DELETE FROM contacts WHERE id=?', [req.params.id], (err, deleteResults) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.status(200).send(deleteResults);
        });
    })
    .get((req, res, next) => {
        db.query('SELECT * FROM contacts WHERE id=?', [req.params.id], (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            console.log(results);
            if (!results.length) {
                return res.status(404).send(`No contact with id ${req.params.id}`);
            }
            res.send(results);
        });
    })
    .put((req, res) => {
        console.log('entered put');
        console.log('req.query',req.query);
        console.log(' req.params', req.params);
        console.log(' req.body', req.body);
        db.query('UPDATE contacts SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE id = ?', 
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
