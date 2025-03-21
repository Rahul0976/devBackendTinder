const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,

      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true, //require feild can not blank
      unique: true, //prevent duplicate
      lowercase: true,
      trim: true, //remove white spaces
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not Valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "this is a default about user",
      minLength: 10,
      maxLength: 150,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "WEBDEV@Tinder$098", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validateUser = async function (passwordInputByUser) {
  const user = this;
  const passwordValid = bcrypt.compare(passwordInputByUser, user.password);
  return passwordValid;
};
module.exports = mongoose.model("User", userSchema);
