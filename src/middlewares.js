const express = require("express");
const app = express();
// Here the req reaches to first handler and console message will be printed on the terminal
// as we know whenever a request is made to server first tcp connection is established and then
// request is sent over that connection to server
// Now in the first handler we are sending response back to client using res.send() method
// After sending response back to client if we call next() method then req will reach to second handler
// but since response is already sent in the first handler so calling res.send() method again in second handler will throw error

app.get(
  "/user",
  (req, res, next) => {
    console.log("user reached to 1st handler");
    res.send("response from user 1st handler");
    next();
  },
  (req, res) => {
    console.log("user reached to 2nd handler");
    res.send("response from user 2nd handler");
    // This will throw error because response is already sent in the previous handler})
  }
);

app.get(
  "/2user",
  (req, res, next) => {
    console.log("2user reached to 1st handler");
    next();
    res.send("response from 2user 1st handler");
  },
  (req, res, next) => {
    console.log("2user reached to 2nd handler");
    res.send("response from 2user 2nd handler");
  }
);

app.get(
  "/3user",
  (req, res, next) => {
    console.log("3user reached to handler");
    next();
  },
  (req, res) => {
    res.send("response from 3user handler");
    next();
  }
);
app.get(
  "/4user",
  (req, res, next) => {
    console.log("4user reached to handler");
    next();
  },
  (req, res, next) => {
    console.log("user message from 4user handler");
    next();
  }
);

// In the below route handler next() is not called so the request will hang and client will not receive any response
app.get(
  "/5user",
  (req, res, next) => {
    console.log("5user reached to handler");
  },
  (req, res) => {
    res.send("response from 5user handler");
  }
);

app.get("/", (req, res, next) => {
  console.log("6user reached to handler");
  next();
});

app.get("/7user", (req, res, next) => {
  console.log("response from 7user handler");
  next();
});

app.get("/", (req, res) => {
  res.send("response from 8user handler");
});
app.listen(7777, () => {
  console.log("App is up and running on port number 7777");
});
