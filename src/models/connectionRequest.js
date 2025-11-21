const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index(
  {
    fromUserId: 1,
    toUserId: 1,
  },
  {
    unique: true,
  }
);

connectionRequestSchema.index({
  toUserId: 1,
  status: 1,
});
connectionRequestSchema.index({
  fromUserId: 1,
  status: 1,
});

// The method attached below will run each time , before saving the connection request schema

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself...");
  }

  next();
});
const ConnectionRequestModel = mongoose.model(
  "RequestConnection",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
