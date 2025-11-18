const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Provide valid name");
        }
      },
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Provide valid input");
        }
      },
    },
    email: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 50,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validator(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        const genders = ["male", "female", "other"];
        if (!genders.includes(value.toLowerCase())) {
          throw new Error("Gender must be male, female or other");
        }
      },
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 10,
      maxLength: 100,
    },
    isMarried: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [[String, "Provide meaningful skills"]],
    },
    photoUrl: {
      type: String,
      default:
        "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-1024x1024.jpeg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is invalid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "HariBol", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatching = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordMatching;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
