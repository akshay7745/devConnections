const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
