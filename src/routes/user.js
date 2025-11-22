const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName", "skills", "photoUrl"])
      .populate("toUserId", ["firstName", "lastName"]);
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

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  const user = req.user;
  const connections = await ConnectionRequest.find({
    $or: [
      { toUserId: user._id, status: "accepted" },
      {
        fromUserId: user._id,
        status: "accepted",
      },
    ],
  })
    .populate("fromUserId", ["firstName", "lastName", "skills", "photoUrl"])
    .populate("toUserId", ["firstName", "lastName", "skills", "photoUrl"]);

  if (!connections) {
    throw new Error("Invalid id's provided or bad request");
  }

  const connectedUsers = connections.map((connection) => {
    if (connection.fromUserId.toString() === user._id.toString()) {
      return connection.toUserId;
    }
    return connection.fromUserId;
  });
  res.status(200).json({ data: connectedUsers });
});

userRouter.get("/feed", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const allConnectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).populate("fromUserId toUserId", "firstName skills");

    const hideUsersOnFeed = new Set();

    allConnectionRequests.length &&
      allConnectionRequests.forEach((connection) => {
        hideUsersOnFeed.add(connection.fromUserId.toString());
        hideUsersOnFeed.add(connection.toUserId.toString());
      });

    const hideUsersOnFeedArray = Array.from(hideUsersOnFeed);
    console.log("hideUsersOnFeedArray", hideUsersOnFeedArray);
    const showUsersOnFeed = await User.find({
      $and: [
        {
          _id: { $nin: hideUsersOnFeedArray },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    }).select("firstName lastName skills photoUrl");

    res.status(200).json({
      message: "Users fetched successfully",
      data: showUsersOnFeed,
    });
  } catch (error) {
    res
      .status(400)
      .json({
        message:
          "Something went wrong while fetching feed data " + error.message,
      });
  }
});

module.exports = { userRouter };
