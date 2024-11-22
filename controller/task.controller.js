

const Task = require("../models/task.model");


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
 *         description: Danh sách tasks chưa bị xóa
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
module.exports.index =  async (req,res) => {
    console.log(req.query)
    const find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status;
    }
  const getAllTask = await Task.find(find);
 
  res.json(getAllTask);
}



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
        res.json("Không tìm thấy")
    }


}