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

// Get all employees by department
router.get('/employee/department/:dept', (req, res) => {
    const sql = `SELECT * FROM employees
    WHERE departments.id = ?`;
    const params = [req.params.department_id];

     db.query(sql, params, (err, rows) => {
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

// Get all employees by manager
router.get('/employee/manager/:man', (req, res) => {
    const sql = `SELECT * FROM employees
    WHERE employees.manager_id = ?`;
    const params = req.params.manager_id;
     db.query(sql, params, (err, rows) => {
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

// Get total salary budget for a department
router.get('/department/:budget', ({ body }, res) => {
    const sql = `SELECT * FROM roles, 
    LEFT JOIN departments
    ON departments.id = roles.department_id
    WHERE department_id = ?`;
    const params = req.params.department_id;
    db.query(sql, params, (err, res) => {
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

// Create an employee
router.post('/employee', ({ body }, res) => {
    const sql = `INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?, ?)`;
    const params = [body.id, body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (err, res) => {
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

router.put('/employee/:id', ({ body }, res) => {
    const sql = `UPDATE employees
                SET role_id = ?
                Where id = ?`;
                const params = [req.body.role_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
          } else if (!result.affectedRows) {
            res.json({
              message: 'Employee not found'
            });
          } else {
            res.json({
              message: 'success',
              data: req.body,
              changes: result.affectedRows
            });
          }
    })
});

router.delete('/employee/:id', ({ body }, res) => {
    
        const sql = `DELETE FROM employees WHERE id = ?`;
        const params = body.id;
        db.query(sql, params, (err, result) => {
            if (err) {
                res.status(400).json({ error: res.message });
              } else if (!result.affectedRows) {
                res.json({
                  message: 'Candidate not found'
                });
              } else {
                res.json({
                  message: 'deleted',
                  changes: result.affectedRows,
                  id: req.params.id
                });
              }
        });
});

module.exports = router;