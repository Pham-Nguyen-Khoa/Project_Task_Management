const Task = require("../models/task.model");
const paginationHelper = require("../helpers/paginationHelper");
const searchHelper = require("../helpers/searchHelper");
/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Lấy danh sách tất cả tasks chưa bị xóa
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: Tìm kiếm theo tên công việc (VD Code payment, Code FE Home)
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
  let searchObject = searchHelper(req.query);
  //   Filter Status
  if (req.query.status) {
    find.status = req.query.status;
  }
  //  End Filter Status

  // Sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    const key = req.query.sortKey;
    const value = req.query.sortValue;
    sort[key] = value;
  }
  // End Sort

  // Search Keyword
  if (req.query.keyword) {
    find.title = searchObject.regex;
  }
  // End Search Keyword

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };
  const countTasks = await Task.countDocuments(find);
  const paginationObject = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  // End Pagination

  const getAllTask = await Task.find(find)
    .sort(sort)
    .limit(paginationObject.limitItems)
    .skip(paginationObject.skip);
  const data = {
    getAllTasks: getAllTask,
    totalPage: paginationObject.totalPage,
  };
  res.json(data);
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/detail/{id}:
 *   get:
 *     tags:
 *          - Tasks
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
    if(!getTask){
      return res.json({
        code: 400,
        message: "Không có công việc này!"
      });
    }
    return res.json({
      code: 200,
      getTask: getTask
    });
  } catch (error) {
    res.json("Không tìm thấy");
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/change-status/{id}:
 *   patch:
 *     tags:
 *          - Tasks
 *     summary: Cập nhật trạng thái của 1 task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id task mà muốn chuyển trạng thái
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [initial, doing, pending, notFinish, Finish]
 *                 example: doing
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                   code:
 *                     type: number
 *                     example: 200
 *                   message:
 *                     type: string
 *                     example: "Cập nhật trạng thái thành công"
 *       404:
 *         description: Cập nhật trạng thái thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   code:
 *                     type: number
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Cập nhật trạng thái thất bại "
 */

// [PATCH] localhost:3000/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const arrStatus = ["initial", "doing", "finish", "pending", "notFinish"];
    const checkStatus = arrStatus.includes(status);
    if (!checkStatus) {
      return res.json({
        code: 400,
        message: "Không có trạng thái đó",
      });
    }
    await Task.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/change-multi:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Thay đổi trạng thái hoặc xóa nhiều công việc cùng lúc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Mảng chứa các ID của công việc cần thay đổi
 *                 example: ["67404d953cc3cb08f59f9b3d", "67404d953cc3cb08f59f9b3e"]
 *               key:
 *                 type: string
 *                 enum: [status, delete]
 *                 description: Loại thao tác cần thực hiện (thay đổi trạng thái hoặc xóa)
 *                 example: "status"
 *               value:
 *                 type: string
 *                 description: Giá trị mới cho `key` (ví dụ trạng thái hoặc xóa)
 *                 enum: [initial, doing, finish, pending, notFinish, true, false]
 *                 example: "doing"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái 2 công việc thành công"
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Không có trạng thái đó"
 */
// [PATCH] localhost:3000/tasks/change-multi/
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    const countIDs = ids.length;
    if (countIDs == 0) {
      return res.json({
        code: 400,
        message: "Không có id ",
      });
    }
    if(value){
      const arrStatus = [
        "initial",
        "doing",
        "finish",
        "pending",
        "notFinish",
        "true",
        "false",
      ];
      const checkStatus = arrStatus.includes(value);
      if (!checkStatus) {
        return res.json({
          code: 400,
          message: "Không có trạng thái đó",
        });
      }
    }
  
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái  ${countIDs} công việc thành công`,
        });
        break;

      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date()
          }
        );
        res.json({
          code: 200,
          message: `Xóa ${countIDs} công việc thành công`,
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại",
        });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại",
    });
  }
};






// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/create:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Tạo công việc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: String
 *                 description: Tên công việc 
 *                 example: Công việc ABC
 *               status:
 *                 type: string
 *                 description: Trạng thái công việc (initial, pending, doing, finish, notFinish)
 *                 example: "initial"
 *               listUsers:
 *                 type: Array
 *                 description: Những người tham gia ( Mảng chứa id của các user tham gia task )
 *                 example: ["67442d73d93f9eaaf7592e52","6743315ddd1cb0f1c7e9a36c","67442d7bd93f9eaaf7592e55"]
 *               timeStart:
 *                 type: Date
 *                 description: Thời gian bắt đầu công việc 
 *                 example: "2023-09-18T14:43:01.579+00:00"
 *               timeFinish:
 *                 type: Date
 *                 description: Thời gian kết thúc công việc 
 *                 example: "2023-09-18T14:43:01.579+00:00"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Tạo công việc thành công!"
 *                 data: 
 *                    type: object
 *                    properties: 
 *                      title:
 *                       type: String
 *                       description: Tên công việc 
 *                       example: Công việc ABC
 *                      status:
 *                       type: string
 *                       description: Trạng thái công việc (initial, pending, doing, finish, notFinish)
 *                       example: "initial"
 *                      listUsers:
 *                       type: Array
 *                       description: Những người tham gia ( Mảng chứa id của các user tham gia task )
 *                       example: ["67442d73d93f9eaaf7592e52","6743315ddd1cb0f1c7e9a36c","67442d7bd93f9eaaf7592e55"]
 *                      content:
 *                       type: string
 *                       example: "Nội dung Neronen ..."
 *                      timeStart:
 *                       type: Date
 *                       description: Thời gian bắt đầu công việc 
 *                       example: "2023-09-18T14:43:01.579+00:00"
 *                      timeFinish:
 *                       type: Date
 *                       description: Thời gian kết thúc công việc 
 *                       example: "2023-09-18T14:43:01.579+00:00"
 *                  
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Tạo công việc thất bại"
 */
// [POST] localhost:3000/tasks/create/
module.exports.createPost = async (req, res) => {
  try {
    req.body.createdBy = req.user.id
    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "Tạo công việc thành công!",
      data: data
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo công việc thất bại!",
    });
  }
};




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/edit/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Chỉnh sửa công việc
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc muốn chỉnh sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: String
 *                 description: Tên công việc 
 *                 example: Công việc ABC
 *               status:
 *                 type: string
 *                 description: Trạng thái công việc (initial, pending, doing, finish, notFinish)
 *                 example: "initial"
 *               content:
 *                 type: string
 *                 example: "Làm giao diện trang login"
 *               timeStart:
 *                 type: Date
 *                 description: Thời gian bắt đầu công việc 
 *                 example: "2023-09-18T14:43:01.579+00:00"
 *               timeFinish:
 *                 type: Date
 *                 description: Thời gian kết thúc công việc 
 *                 example: "2023-09-18T14:43:01.579+00:00"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cập nhật công việc thành công!"
 *                  
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Cập nhật công việc thất bại"
 */
// [PATCH] localhost:3000/tasks/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Task.updateOne({
      _id: id
    },req.body)
    res.json({
      code: 200,
      message: "Cập nhật  công việc thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật công việc thất bại!",
    });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * /tasks/delete/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Xóa một công việc
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc cần xóa
 *     responses:
 *       200:
 *         description: Xóa công việc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Xóa công việc thành công!"
 *       400:
 *         description: Xóa công việc thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Xóa công việc thất bại!"
 */
// [DELETE] localhost:3000/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Task.updateOne({
      _id: id
    },{
      deleted: true,
      deletedAt: new Date()
    })
    res.json({
      code: 200,
      message: "Xóa công việc thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa  công việc thất bại!",
    });
  }
};
