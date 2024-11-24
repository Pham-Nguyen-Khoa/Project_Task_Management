

const taskRouter = require("./task.router")

const userRouter = require("./users.router")

module.exports = (app) => {

    app.use("/tasks",taskRouter);

    app.use("/users",userRouter);

};
