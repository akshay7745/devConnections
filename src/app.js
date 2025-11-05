const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("hello from express server");
});

app.listen(7777, () => {
  console.log(`Server is up and running on port number 7777`);
});
