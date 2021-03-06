const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');
const db = require('./db/connection');
const router = require('./routes/employeeRoutes');
const { restoreDefaultPrompts } = require('inquirer');
const { use } = require('./routes/employeeRoutes');
const { end } = require('./db/connection');


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
        choices: ['View all employees', 'View all employees by department','View all employees by manager', 'View all roles', 'View all departments', 'Add employee', 'Add role', 'Add department', 'Remove employee', 'Update employee role', 'Quit']
    });
    
    if (answers.chooseAction == 'View all employees') {
        viewAllEmployees();
    } else if (answers.chooseAction == 'View all employees by department') {
        viewAllByDepartment();
    } else if (answers.chooseAction == 'View all employees by manager') {
        viewAllByManager();
    } else if (answers.chooseAction == 'View all roles') {
        viewAllRoles();   
    } else if (answers.chooseAction == 'View all departments') {
        viewAllDepartments();
    } else if (answers.chooseAction == 'Add employee') {
        addEmployee();
    } else if (answers.chooseAction == 'Add role') {
        addRole();
    } else if (answers.chooseAction == 'Add department') {
        addDepartment();
    } else if (answers.chooseAction == 'Remove employee') {
        removeEmployee();
    } else if (answers.chooseAction == 'Update employee role') {
        updateRole();
    } else {
        quitApp();
    }   
};

const viewAllEmployees = async () => {
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
        userPrompt();
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
        userPrompt();
    });
};

const viewAllByManager = async () => {
    const whatMan = await inquirer
    .prompt({
        type: 'number',
        name: 'manChoice',
        message: 'What is the manager id?',
    });
    db.query(
        
        
        /*`SELECT * FROM employees
    INNER JOIN employees
    ON employees.id = employees.manager_id
    WHERE manager_id = ?
    `*/
    
    `SELECT * FROM employees
    WHERE employees.manager_id = ?
    `
    , whatMan.manChoice, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        userPrompt();
    });
};

const viewAllRoles = async () =>
    db.query(`
    SELECT roles.*, departments.name
    AS department_name
    FROM roles
    LEFT JOIN departments
    ON roles.department_id = departments.id`, 
    (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        userPrompt();
    }); 

    const viewAllDepartments = async () =>
    db.query(`
    SELECT * FROM departments`,
     (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        userPrompt();
    }); 


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
        userPrompt();
    }

    )
};

const addRole = async () => {
    const createRole = await inquirer
    .prompt([
    {
        type: 'number',
        name: 'newRoleId',
        message: 'What is the id of the new role?'
    },
    {
        type: 'input',
        name: 'newRoleTitle',
        message: 'What is the title of this role?'
    },
    {
        type: 'number',
        name: 'newRoleSalary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'number',
        name: 'newRoleDeptId',
        message: 'What is the department id for this role?'
    },
]);
    db.query(`INSERT INTO roles (id, title, salary, department_id)
    VALUES (?, ?, ?, ?)`, 
    [
    createRole.newRoleId,
    createRole.newRoleTitle, 
    createRole.newRoleSalary, 
    createRole.newRoleDeptId
    ], 
    (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
        userPrompt();
    }

    )
};

const addDepartment = async () => {
    const createDepartment = await inquirer
    .prompt([
    {
        type: 'number',
        name: 'newDeptId',
        message: 'What is the id of the new department?'
    },
    {
        type: 'input',
        name: 'newDeptName',
        message: 'What is the name of the new department?'
    }
]);
    db.query(`INSERT INTO departments (id, name)
    VALUES (?, ?)`, 
    [
    createDepartment.newDeptId,
    createDepartment.newDeptName
    ], 
    (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
        userPrompt();
    }

    )
};

// Delete an employee from the database
const removeEmployee = async () => {
    const deleteEmp = await inquirer
    .prompt({
        type: 'number',
        name: 'deleteEmpId',
        message: 'What is the id of the employee you wish to delete?'
    });
    db.query(`DELETE FROM employees WHERE id = ?`, 
        deleteEmp.deleteEmpId,
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
            userPrompt();
        });
    };    

const updateRole = async () => {
    const roleUpdate = await inquirer
    .prompt([
        {
        type: 'number',
        name: 'empId',
        message: 'What is the id of the employee you wish to update?'
        },
        {
        type: 'number',
        name: 'roleId',
        message: 'What is the new role id for this employee?'
        }
    ]);
    db.query(`UPDATE employees
    SET role_id = ?
    Where id = ?`, [roleUpdate.roleId, roleUpdate.empId],
    (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        userPrompt();
    });
};

const quitApp = () => {
    console.log('Goodbye')
};

userPrompt();
