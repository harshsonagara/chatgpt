const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

router.get('/', authMiddleware.authUser, (req, res) => {
  res.render('home');
});

module.exports = router;
