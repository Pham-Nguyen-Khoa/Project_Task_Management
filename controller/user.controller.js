const User = require("../models/user.model");
const md5 = require("md5");



/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Đăng nhập
 *     description: Kiểm tra thông tin đăng nhập của người dùng và trả về token nếu thành công.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *       400:
 *         description: Lỗi xảy ra trong quá trình đăng nhập.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Email không tồn tại hoac Mật khẩu không chính xác"  
 */
// [POST] localhost:3000/users/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 400,
        message: "Email không tồn tại",
      });
    }
    if (md5(password) != user.password) {
      return res.json({
        code: 400,
        message: "Mật khẩu không chính xác",
      });
    }

    res.cookie("token", user.token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: user.token
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng nhập thất bại",
    });
  }
};

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Đăng ký tài khoản mới
 *     description: Tạo tài khoản người dùng mới và lưu thông tin vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ và tên của người dùng
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Tài khoản được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Tạo tài khoản thành công"
 *       400:
 *         description: Lỗi xảy ra trong quá trình tạo tài khoản.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Email đã tồn tại"
 */

// [POST] localhost:3000/users/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const emailExist = await User.findOne({
      email: email,
      deleted: false,
    });
    if (emailExist) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại",
      });
    }
    const user = new User({
      fullName: fullName,
      email: email,
      password: md5(password),
    });
    await user.save();
    res.cookie("token", user.token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo tài khoản thất bại",
    });
  }
};
