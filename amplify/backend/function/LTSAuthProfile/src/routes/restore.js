const express = require('express');
const router = express.Router();
const restorePasswordController = require('../controllers/restorePasswordController');

router.post('/', restorePasswordController.handleRestorePassword);
module.exports = router;