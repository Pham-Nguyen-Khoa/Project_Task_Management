const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.controller");

router.get("/", taskController.index);

router.get("/detail/:id", );

module.exports = router;
