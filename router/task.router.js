const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.controller");
const taskValidate = require("../validate/task.validate");


router.get("/", taskController.index);

router.get("/detail/:id", taskController.detail );

router.patch("/change-status/:id", taskController.changeStatus );


router.patch("/change-multi/" , taskController.changeMulti);

router.post("/create" , taskValidate.editPatch , taskController.createPost);

router.patch("/edit/:id" , taskValidate.editPatch ,taskController.editPatch);


router.patch("/edit/:id" , taskValidate.editPatch ,taskController.editPatch);


router.delete("/delete/:id" ,taskController.delete);


module.exports = router;
