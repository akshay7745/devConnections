const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/signupValidation.js");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
// The express.json() middleware is used to parse JSON bodies, means the incoming data from request body our server cant understand or read it directly so we need to use this middleware to parse it and make it readable for our server(this middleware is reads the json data passed from request body and converts it into javascript object and attaches it to req.body)
const { userAuth } = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const userData = await user.save();
    res
      .status(201)
      .json({ message: "User signed up successfully", user: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error signing up user: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Please enter valid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ _id: user._id }, "HariBol", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Cookie read successfully", user: req.user });
  } catch (error) {
    res.status(500).send("Error reading cookie " + error.message);
  }
});

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
