const adminAuth = (req, res, next) => {
  const token = "lslsiosos";

  if (token === "lslsiosos") {
    console.log("Admin authenticated");
    next();
  } else {
    res.status(403).send("Admin not authenticated");
  }
};

const userAuth = (req, res, next) => {
  const userToken = "userlslsls";
  if (userToken === "userlslsls") {
    console.log("User authenticated");
    next();
  } else {
    res.status(403).send("User not authenticated");
  }
};

module.exports = { adminAuth, userAuth };
