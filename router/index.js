

const taskRouter = require("./task.router")

const userRouter = require("./users.router")

const authenMiddleware = require("../middleware/authen.middleware");



module.exports = (app) => {

    app.use("/tasks", authenMiddleware.requireAuth ,taskRouter);

    app.use("/users",userRouter);

};
