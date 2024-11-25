const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  content: String,
  timeStart: Date,
  timeFinish: Date,
  createdBy: String,
  listUsers: Array,
  taskParentID: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},{
    timestamps: true
});
const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;


// _id
// 67404d953cc3cb08f59f9b3d
// title
// "Công việc 1"
// status
// "initial"
// content
// "Nội dung công việc 1..."
// timeStart
// "2023-09-18T14:43:01.579+00:00"
// timeFinish
// "2023-09-24T14:43:01.579+00:00"
// createdAt
// "2023-09-16T14:43:01.579+00:00"
// updatedAt
// "2023-09-16T14:43:01.579+00:00"
// deleted
// false