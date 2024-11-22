const Task = require("../models/task.model");
const paginationHelper = require("../helpers/paginationHelper");
/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Lấy danh sách tất cả tasks chưa bị xóa
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Trạng thái công việc (pending, initial, doing,finish,notFinish)
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *         required: false
 *         description: Sắp xếp theo tiêu chí gì ( title , timeStart, timeFinish, createAt, updateAt, _id)
 *       - in: query
 *         name: sortValue
 *         schema:
 *           type: string
 *         required: false
 *         description: Sắp xếp tăng dần hay giảm dần ( asc desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Tổng số task trên 1 trang mặc định 2 task (VD limit = 2 , limit = 3) 
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Trang hiện tại ( pagination VD page=1, page=2)
 *     responses:
 *       200:
 *         description: Danh sách tasks chưa bị xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "63f15fdcd99e4b23a46dbcd7"
 *                   title:
 *                     type: string
 *                     example: "Task A"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   timeStart:
 *                     type: Date
 *                     example: "2023-09-18T14:43:01.579Z"
 *                   timeFinish:
 *                     type: Date
 *                     example: "2023-09-18T14:43:01.579Z"
 *                   createdAt:
 *                      type: Date
 *                      example: "2023-09-18T14:43:01.579Z"
 *                   updatedAt:
 *                      type: Date
 *                      example: "2023-09-18T14:43:01.579Z"
 *                   deleted:
 *                     type: boolean
 *                     example: false
 */

// [GET] localhost:3000/tasks
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const limit = 2;
  if (req.query.status) {
    find.status = req.query.status;
  }
  const sort = {};
  
  if (req.query.sortKey && req.query.sortValue) {
    const key = req.query.sortKey;
    const value = req.query.sortValue;
    sort[key] = value;
  }
  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2   
  }
  const countTasks = await Task.countDocuments(find)
  const paginationObject = paginationHelper(initPagination, req.query, countTasks)
  const getAllTask = await Task.find(find).sort(sort).limit(paginationObject.limitItems).skip(paginationObject.skip);
  const data = {
    getAllTasks: getAllTask,
    totalPage : paginationObject.totalPage
  }
  res.json(data);
};

/**
 * @swagger
 * /tasks/detail/{id}:
 *   get:
 *     tags:
 *          - Task
 *     summary: Lấy chi tiết một task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của task
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của task
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "63f15fdcd99e4b23a46dbcd7"
 *                   title:
 *                     type: string
 *                     example: "Task A"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   timeStart:
 *                     type: Date
 *                     example: "2023-09-18T14:43:01.579Z"
 *                   timeFinish:
 *                     type: Date
 *                     example: "2023-09-18T14:43:01.579Z"
 *                   createdAt:
 *                      type: Date
 *                      example: "2023-09-18T14:43:01.579Z"
 *                   updatedAt:
 *                      type: Date
 *                      example: "2023-09-18T14:43:01.579Z"
 *                   deleted:
 *                     type: boolean
 *                     example: false
 *       404:
 *         description: Task không tồn tại
 */
// [GET] localhost:3000/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const getTask = await Task.findOne({ _id: id, deleted: false });
    return res.json(getTask);
  } catch (error) {
    res.json("Không tìm thấy");
  }
};
