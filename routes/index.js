const express = require('express');
const router = express.Router();

router.use(require('./employeeRoutes'));

module.exports = router;