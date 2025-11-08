const express = require("express");
const app = express();

//error handling 1st way

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something went wrong!");
//   } else {
//     res.send("No error occurred");
//   }
// });

//error handling 2nd way using try catch block this is more common way of handling errors in express

app.get("/userData", (req, res) => {
  throw new Error("Some error occurred while fetching user data");
  res.send("User data fetched successfully");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => {
  console.log(`Server is up and running on port number 7777`);
});
