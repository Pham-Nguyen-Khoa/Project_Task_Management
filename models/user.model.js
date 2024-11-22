const mongoose = require("mongoose");
const generateHelper = require("../helpers/generateHelper");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  token: {
    type: String,
    default: generateHelper.generateRandomString(30)
  },
  deleted: {
    type: Boolean,
    default: false
  },
},{
    timestamps: true
});
const User = mongoose.model("User", userSchema, "users");

module.exports = User;

