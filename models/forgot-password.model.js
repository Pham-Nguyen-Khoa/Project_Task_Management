const mongoose = require("mongoose");

const forgotSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expire: 180
  }
});
const ForgotPassword = mongoose.model("ForgotPassword", forgotSchema, "forgot-password");

module.exports = ForgotPassword;

