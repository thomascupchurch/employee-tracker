const express = require('express');
const { builtinModules } = require('module');
const router = express.Router();
const db = require('../db/connection');


// GET all employees
router.get('/employee', (req, res) => {
    const sql = `SELECT employees.*, roles.title
    AS role_title
    FROM employees
    LEFT JOIN roles
    ON employees.role_title = roles.title`;


    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/employee/department/:dept', (req, res) => {
    const sql = `SELECT * FROM employees
    WHERE departments.id = ?`;

     db.query(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
     })
    
});

router.get('/employee/manager/:man', (req, res) => {
    const sql = `SELECT * FROM employees
    WHERE employees.manager_id = ?`;

     db.query(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
     })
    
});

// GET a single employee
router.get('/employee/:id', (req, res) => {
    const sql = `SELECT employees.*, roles.title
    AS role_title
    FROM employees
    LEFT JOIN roles
    ON employees.role_title = roles.title
    WHERE employees.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Create an employee
router.post('/employee', ({ body }, res) => {
    const sql = `INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [body.id, body.first_name, body.last_name, body.role_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

router.put('/employee', ({ body }, res) => {

})

module.exports = router;