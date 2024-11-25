const User = require("../models/user.model");
const md5 = require("md5");
const generateHelper = require("../helpers/generateHelper");
const ForgotPassword = require("../models/forgot-password.model");
const nodeMailerHelper = require("../helpers/nodemailer");



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
      token: user.token,
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
    const token  = generateHelper.generateRandomString(30);
    const user = new User({
      fullName: fullName,
      email: email,
      password: md5(password),
      token: token
    });
    await user.save();
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công",
      token: token
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo tài khoản thất bại",
    });
  }
};




/**
 * @swagger
 * /users/password/forgot:
 *   post:
 *     tags:
 *       - Forgot-Password
 *     summary: Quên mật khẩu
 *     description: Gửi mã OTP đến email của người dùng để khôi phục mật khẩu.
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
 *     responses:
 *       200:
 *         description: Gửi OTP thành công.
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
 *                   example: "Đã gửi OTP qua email"
 *                 email:
 *                   type: string
 *                   example: example@gmail.com
 *       400:
 *         description: Lỗi trong quá trình gửi OTP hoặc email không tồn tại.
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
 *                   example: "Email không tồn tại hoặc Lỗi trong quá trình khôi phục mật khẩu"
 */
// [POST] localhost:3000/users/password/forgot
module.exports.forgot = async (req, res) => {
  try {
    const email = req.body.email;

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

    const otp = generateHelper.generateRandomNumber(6);
    const forgotPassword = new ForgotPassword({
      email: email,
      otp: otp,
      expireAt:  Date.now() + 5*60*1000,
    });
    await forgotPassword.save();
    const descriptionHTML = ` <h1>Mã OTP của bạn là <b>${otp}</b></h1>`;
    nodeMailerHelper.sendMail(email, "Khôi phục mật khẩu ", descriptionHTML);

    res.json({
      code: 200,
      message: "Đã gửi OTP qua email",
      email: email,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi trong quá trình khôi phục mật khẩu",
    });
  }
};



/**
 * @swagger
 * /users/password/otp:
 *   post:
 *     tags:
 *       - Forgot-Password
 *     summary: Xác thực mã OTP
 *     description: Kiểm tra mã OTP do người dùng nhập và trả về token nếu thành công.
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
 *               otp:
 *                 type: string
 *                 description: Mã OTP được gửi qua email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công.
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
 *                   example: "Xác thực thành công"
 *                 token:
 *                   type: string
 *                   description: Token của người dùng
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Lỗi trong quá trình xác thực OTP hoặc mã OTP không đúng.
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
 *                   example: "Mã OTP không đúng! hoặc Lỗi trong quá trình khôi phục mật khẩu"
 */
// [POST] localhost:3000/users/password/otp
module.exports.otp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const forgotObject = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });
    if (!forgotObject) {
      return res.json({
        code: 400,
        message: "Mẫ OTP không đúng!",
      });
    }
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    res.cookie("token", user.token);
    res.json({
      code: 200,
      message: "Xác thực thành công",
      token: user.token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi trong quá trình khôi phục mật khẩu",
    });
  }
};




/**
 * @swagger
 * /users/password/reset:
 *   post:
 *     tags:
 *       - Forgot-Password
 *     summary: Đặt lại mật khẩu
 *     description: Đặt lại mật khẩu mới cho tài khoản dựa trên token xác thực.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Mật khẩu mới
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Xác nhận mật khẩu mới
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công.
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
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Lỗi khi đổi mật khẩu, có thể do token không hợp lệ, mật khẩu không khớp, hoặc lỗi hệ thống.
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
 *                   example: "Mật khẩu không khớp! hoặc Đổi mật khẩu thất bại"
 */
// [POST] localhost:3000/users/password/reset
module.exports.reset = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.json({
        code: 400,
        message: "Mật khẩu không khớp!",
      });
    }
    const user = await User.findOne({
      token: token,
    });
    if (md5(password) == user.password) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ",
      });
    }
    await User.updateOne(
      {
        token: token,
        deleted: false,
      },
      {
        password: md5(password),
      }
    );
    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đổi mật khẩu thất bại",
    });
  }
};



/**
 * @swagger
 * /users/detail:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy thông tin chi tiết người dùng
 *     description: Lấy thông tin tài khoản của người dùng dựa trên token trong cookie.
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công.
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
 *                   example: "Lấy thông tin thành công"
 *                 info:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "63f15fdcd99e4b23a46dbcd7"
 *                     fullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     email:
 *                       type: string
 *                       example: "example@gmail.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-18T14:43:01.579Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-18T14:43:01.579Z"
 *       400:
 *         description: Lỗi khi lấy thông tin người dùng.
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
 *                   example: "Lấy thông tin thất bại"
 */

// [GET] localhost:3000/users/detail
module.exports.detail = async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "Lấy thông tin thành công",
      info: req.user,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lấy thông tin thất bại",
    });
  }
};



/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags:
 *       - User
 *     summary: Đăng xuất người dùng
 *     description: Xóa cookie chứa token để đăng xuất người dùng khỏi hệ thống.
 *     responses:
 *       200:
 *         description: Đăng xuất thành công.
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
 *                   example: "Đăng xuất thành công"
 *       400:
 *         description: Lỗi khi đăng xuất.
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
 *                   example: "Đăng xuất thất bại"
 */
// [GET] localhost:3000/users/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      code: 200,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng xuất thất bại",
    });
  }
};



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: [] # Đánh dấu rằng endpoint yêu cầu token
 *
 * /users/list:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy ra danh sách tất cả user trong hệ thống
 *     description: Retrieve a list of all users with their full name and email, excluding deleted users.
 *     security:
 *       - bearerAuth: [] # Kích hoạt bảo mật
 *     responses:
 *       200:
 *         description: "Lấy danh sách user thành công"
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
 *                   example: "Lấy danh sách user thành công"
 *                 listUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                         example: "Nguyen Van A"
 *                       email:
 *                         type: string
 *                         example: "nguyenvana@example.com"
 *       400:
 *         description: "Lấy danh sách user thất bại"
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
 *                   example: "Lấy danh sách user thất bại"
 */
// [GET] localhost:3000/users/list
module.exports.getAll = async (req, res) => {
  try {
    const listUser = await User.find({
      deleted: false
    }).select("fullName email");
    res.json({
      code: 200,
      message: "Lấy danh sách user thành công",
      listUser: listUser
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lấy danh sách user thất bại",
      
    });
  }
};
