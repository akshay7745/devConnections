const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const {
  profileUpdateValidation,
} = require("../utils/profileUpdateValidation.js");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Cookie read successfully", user: req.user });
  } catch (error) {
    res.status(500).send("Error reading cookie " + error.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidProfileUpdate = profileUpdateValidation(req);
    console.log("Profile line number 21 ", isValidProfileUpdate);
    if (!isValidProfileUpdate) {
      throw new Error("Please provide the valid fields to update the profile");
    }

    const fieldsToUpdate = Object.keys(req.body);

    fieldsToUpdate.forEach((key) => {
      req.user[key] = req.body[key];
    });

    await req.user.save();

    res.status(200).json({
      message: `${req.user.firstName} your profile updated successfully`,
      data: req.user,
    });
  } catch (error) {
    res
      .status(500)
      .send("Something went wrong while updating profile " + error.message);
  }
});
module.exports = { profileRouter };
