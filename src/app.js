const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/signupValidation.js");
const validator = require("validator");
// The express.json() middleware is used to parse JSON bodies, means the incoming data from request body our server cant understand or read it directly so we need to use this middleware to parse it and make it readable for our server(this middleware is reads the json data passed from request body and converts it into javascript object and attaches it to req.body)

app.use(express.json());

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

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
});
app.post("/updateUser/:id", async (req, res) => {
  const { id } = req.params;

  const allowedValues = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "address",
    "skills",
    "isMarried",
    "photoUrl",
  ];

  const allowUpdate = Object.keys(req.body).every((key) => {
    return allowedValues.includes(key);
  });
  try {
    if (!allowUpdate) {
      return res.status(400).send("Invalid updates!");
    }

    if (req.body?.skills.length > 10) {
      return res.status(400).send("Skills cannot be more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).send("Error updating user data " + error.message);
  }
});

app.get("/userOne", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).json({ user: user });
    }
  } catch (error) {
    res.status(500).send("Error fetching user data");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.status(200).json({ users });
    }
  } catch (error) {
    res.status(500).send("Error fetching users data");
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
