const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

// The express.json() middleware is used to parse JSON bodies, means the incoming data from request body our server cant understand or read it directly so we need to use this middleware to parse it and make it readable for our server(this middleware is reads the json data passed from request body and converts it into javascript object and attaches it to req.body)

app.use(express.json());

app.post("/signup", async (req, res) => {
  // const user = new User({
  //   firstName: "Govind",
  //   lastName: "Hari",
  //   email: "govind@golok.hare",
  //   password: "HareKrishnaMahamantra",
  //   age: 16,
  //   gender: "purush",
  //   address: "Golok Vrindavan",
  //   isMarried: true,
  // });
  // user.save method returns a promise so it is better to use async await or then catch
  // for now we will convert this function into async

  const user = new User(req.body);

  try {
    const userData = await user.save();
    res
      .status(201)
      .json({ message: "User signed up successfully", user: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error signing up user");
  }
});

app.post("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });
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
