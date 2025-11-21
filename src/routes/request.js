const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const connectionRequestRoute = express.Router();

connectionRequestRoute.post(
  "/connection/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.userId;
      const user = req.user;
      const fromUserId = user._id;
      // const fromUserId = user._id.toString();
      console.log(toUserId, fromUserId);
      const allowedStatusValues = ["interested", "ignored"];

      if (!allowedStatusValues.includes(status)) {
        throw new Error(`Invalid status value: ${status}`);
      }
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error(`No user exists with id: ${toUserId}`);
      }

      const isAlreadyConnectionExists = await ConnectionRequest.findOne({
        $or: [
          {
            toUserId,
            fromUserId,
          },
          {
            toUserId: fromUserId,
            fromUserId: toUserId,
          },
        ],
      });

      if (isAlreadyConnectionExists) {
        throw new Error("Connection request already exists..");
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      //! below 2 checks are doing the same thing and also I have implemented schema level pre method
      // if (user._id.toString() === toUserId) {
      //   throw new Error("Can't send connection request to self or same user");
      // }
      // if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
      //   throw new Error("Can't send connection request to self or same user");
      // }
      const newConnection = await connectionRequest.save();

      res.status(200).json({
        message:
          status === "interested"
            ? `${req.user.firstName} ,connection request is sent to ${toUser.firstName}.`
            : `${req.user.firstName} you have ignored ${toUser.firstName}'s profile.`,
        data: newConnection,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Something went wrong while handling connection request " +
          error.message,
      });
    }
  }
);

module.exports = { connectionRequestRoute };
