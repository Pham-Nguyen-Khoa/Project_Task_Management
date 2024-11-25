const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authenMiddleware = require("../middleware/authen.middleware");

router.post("/login", userController.login);

router.post("/register", userController.register);

router.post("/password/forgot", userController.forgot);

router.post("/password/otp", userController.otp);


router.post("/password/reset", userController.reset);


router.get("/detail",  authenMiddleware.requireAuth, userController.detail);

router.get("/logout", userController.logout);

router.get("/list", authenMiddleware.requireAuth, userController.getAll);

router.get("/test", userController.test);



module.exports = router;
