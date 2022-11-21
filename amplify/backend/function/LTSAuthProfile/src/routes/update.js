const express = require('express');
const router = express.Router();
const updatePasswordController = require('../controllers/updatePasswordController');

router.post('/', updatePasswordController.handleUpdatePassword);
module.exports = router;