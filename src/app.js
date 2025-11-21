const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const cookieParser = require("cookie-parser");

// The express.json() middleware is used to parse JSON bodies, means the incoming data from request body our server cant understand or read it directly so we need to use this middleware to parse it and make it readable for our server(this middleware is reads the json data passed from request body and converts it into javascript object and attaches it to req.body)

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { passwordRoute } = require("./routes/password.js");
const { connectionRequestRoute } = require("./routes/request.js");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", passwordRoute);
app.use("/", connectionRequestRoute);

app.get("/userById/:id", async (req, res) => {
  const { id } = req.params;
  console.log("userId", id);
  const userData = await User.findById(id, "firstName email").exec();
  res.status(200).json(userData);
});

connectDB()
  .then((res) => {
    console.log("db connected successfully");
    app.listen(7777, () => {
      console.log(`Server is up and running on port number 7777`);
    });
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });
