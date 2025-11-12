const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 50,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    age: {
      type: [Number, "Age must be a number"],
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
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
      default: [],
    },
    photoUrl: {
      type: String,
      default:
        "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-1024x1024.jpeg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
