const express = require('express');
const router = express.Router();
const registerEmployeeController = require('../../controllers/registerEmployeeController');

router.post('/', registerEmployeeController);

module.exports = router;
