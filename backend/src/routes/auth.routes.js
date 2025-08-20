const express = require('express');
const router = express.Router();
const { getRegisterController, postRegisterController ,getLoginController, postLoginController ,userLogout } = require("../controller/auth.controller")

// Authentication routes

router.route('/register')
    .get(getRegisterController)
    .post(postRegisterController);


router.route('/login')
    .get(getLoginController)
    .post(postLoginController);

    router.route('/logout')
        .get(userLogout);

module.exports = router;
