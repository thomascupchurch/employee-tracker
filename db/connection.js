const mysql = require('mysql2');
require("dotenv").config();

const db = mysql.createConnection(
    {
    host: 'localhost',

    user: 'root',

    password: 'WalkerUp1*',
    database: 'employee_tracker'
},
console.log('Connected to the employee tracker database.')
);

module.exports = db;