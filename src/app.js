const express = require("express");
const app = express();
app.use("/hello", (req, res) => {
  res.send("hello from /hello endpoint");
});

app.use("/test", (req, res) => {
  res.send("hello from /test endpoint");
});

app.use((req, res) => {
  res.send("hello from express server");
});

app.listen(7777, () => {
  console.log(`Server is up and running on port number 7777`);
});
