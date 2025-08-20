const express = require('express');
const router = express.Router();
const { getRegisterController } = require("../controller/auth.controller")

// Authentication routes

router.get('/register', getRegisterController);
// router.post('/login');

module.exports = router;
