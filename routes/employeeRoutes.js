const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/employees', (req, res) => {
    const sql = `SELECT employee.*, role.name
    AS 
    
    ON employee.role_id = role.id`
})