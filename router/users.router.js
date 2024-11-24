const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/login", userController.login);

router.post("/register", userController.register);

router.post("/password/forgot", userController.forgot);

router.post("/password/otp", userController.otp);


router.post("/password/reset", userController.reset);



module.exports = router;
