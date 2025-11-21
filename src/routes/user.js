const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "skills", "photoUrl"]);
    if (!connectionRequests) {
      throw new Error("Invalid request for getting connection requests...");
    }

    res.status(200).json({
      message: "Connections fetched successfully.",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Something went wrong while fetching connection data " + error.message,
    });
  }
});

module.exports = { userRouter };
