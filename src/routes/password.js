const express = require("express");
const passwordRoute = express.Router();
const { userAuth } = require("../middleware/auth");
const validator = require("validator");
const bcrypt = require("bcrypt");

passwordRoute.patch("/updatePassword", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;
    const user = req.user;
    const isPasswordSame = await user.validatePassword(newPassword);
    if (!newPassword.length) {
      throw new Error("Please provide valid password");
    } else if (isPasswordSame) {
      throw new Error("New password and old password can't be same");
    } else if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please provide strong password");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;

    await user.save();
    res.status(200).json({
      message: `${user.firstName} your password has been updated successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating password " + error.message,
    });
  }
});

module.exports = { passwordRoute };
