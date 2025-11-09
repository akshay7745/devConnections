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
