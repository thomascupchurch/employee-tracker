const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');
const db = require('./db/connection');
const router = require('./routes/employeeRoutes');
const { restoreDefaultPrompts } = require('inquirer');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/employees', employeeRoutes);

app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

console.log(`
================
Employee Tracker
================
`);
const userPrompt = async () => {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'chooseAction',
        message: 'What would you like to do?',
        choices: ['View all employees', 'View all employees by department','View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'quit']
    });
    
    if (answers.chooseAction == 'View all employees') {
        viewAll();
    } else if (answers.chooseAction == 'View all employees by department') {
        viewAllByDepartment();
    } else if (answers.chooseAction == 'View all employees by manager') {
        viewAllByManager();
    } else if (answers.chooseAction == 'Add employee') {
        addEmployee();
    } else if (answers.chooseAction == 'Remove employee') {
        removeEmployee();
    } else if (answers.chooseAction == 'Update employee role') {
        updateRole();
    } else if (answers.chooseAction == 'Update employee manager') {
        updateManager();
    } else {
        quitApp();
    }
    
};

const viewAll = async () => {
    db.query(`
    SELECT employees.*, roles.title
    AS role_title
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
    });
};

const viewAllByDepartment = async () => {
    const whatDept = await inquirer
    .prompt({
        type: 'number',
        name: 'deptChoice',
        message: 'What is the department number?',
    });
    db.query(`SELECT * FROM employees
    LEFT JOIN roles
    ON roles.id = employees.role_id
    WHERE department_id = ?
    `, whatDept.deptChoice, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
    });
};

const viewAllByManager = async () => {
    const whatMan = await inquirer
    .prompt({
        type: 'number',
        name: 'manChoice',
        message: 'What is the manager id?',
    });
    db.query(`SELECT * FROM employees
    LEFT JOIN employees
    ON employees.id = employees.manager_id
    WHERE manager_id = ?
    `, whatMan.manChoice, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
    });
};

const addEmployee = async () => {
    const createEmployee = await inquirer
    .prompt([
    {
        type: 'number',
        name: 'newEmpId',
        message: 'What is the id of the new employee?'
    },
    {
        type: 'input',
        name: 'newEmpFirst',
        message: 'What is the first name of the employee?'
    },
    {
        type: 'input',
        name: 'newEmpLast',
        message: 'What is the last name of the employee?'
    },
    {
        type: 'number',
        name: 'newEmpRoleId',
        message: 'What is the role id for this employee?'
    },
    {
        type: 'number',
        name: 'newEmpManId',
        message: 'What is the manager id for this employee?'
    }
]);
    db.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?, ?)`, 
    [createEmployee.newEmpId,
    createEmployee.newEmpFirst, 
    createEmployee.newEmpLast, 
    createEmployee.newEmpRoleId, 
    createEmployee.newEmpManId], 
    (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
    }

    )
};

const removeEmployee = async () => {
    const deleteEmp = await inquirer
    .prompt({
        type: 'number',
        name: 'deleteEmpId',
        message: 'What is the id of the employee you wish to delete?'
    });
    db.query(`DELETE FROM employees WHERE id = ?`,
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    };
    


const updateRole = async () => {

};

const updateManager = async () => {

};

const quitApp = () => {
    console.log('Goodbye');
}

userPrompt();
