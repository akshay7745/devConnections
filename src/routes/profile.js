const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Cookie read successfully", user: req.user });
  } catch (error) {
    res.status(500).send("Error reading cookie " + error.message);
  }
});

module.exports = { profileRouter };
