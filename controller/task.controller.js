

const Task = require("../models/task.model");


/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *        - Food
 *     summary: Lấy danh sách tất cả tasks chưa bị xóa
 *     responses:
 *       200:
 *         description: Danh sách tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hekk'
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
 *               $ref: '#/components/schemas/Task'
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