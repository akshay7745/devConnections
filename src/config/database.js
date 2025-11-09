const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akshay:Haribol%407745837899@cluster0.xiwm7.mongodb.net/devConnections"
  );
};

module.exports = connectDB;
