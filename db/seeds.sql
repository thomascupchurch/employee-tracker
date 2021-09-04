INSERT INTO departments (id, name)
VALUES
(7, 'shipping'),
(6, 'marketing'),
(5, 'IT'),
(4, 'collection'),
(3, 'manufacturing'),
(2, 'R&D'),
(1, 'sales');


INSERT INTO roles (id, title, salary, department_id)
VALUES
(1, 'CEO', 450000, 2),
(2, 'sales manager', 80000, 1),
(3, 'enforcer', 100000, 4),
(4, 'computer guy', 90000, 5),
(5, 'ad man', 120000, 6),
(6, 'assembly line worker', 40000, 3),
(7, 'truck driver', 75000, 7);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Vincent', 'Celozzo', 1, 1),
(2, 'Costanza', 'Celozzo', 1, 1),
(3, 'Jackie', 'Garbanzo', 3, 4),
(4, 'Joey', 'Bananas', 6, 7),
(5, 'Billy', 'Giordano', 2, 1),
(6, 'Ercole', 'Soprano', 7, 2),
(7, 'Maria', 'Valenti', 3, 3);
