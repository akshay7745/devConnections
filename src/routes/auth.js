const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/signupValidation.js");
const validator = require("validator");

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Please enter valid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWTToken();
    console.log("got token", token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const userData = await user.save();
    res
      .status(201)
      .json({ message: "User signed up successfully", user: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error signing up user: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.status(200).send("logout successfully...");
});

module.exports = { authRouter };
