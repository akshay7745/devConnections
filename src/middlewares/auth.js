const User = require("../models/user");

const adminAuth = (req, res, next) => {
  const token = "lslsiosos";

  if (token === "lslsiosos") {
    console.log("Admin authenticated");
    next();
  } else {
    res.status(403).send("Admin not authenticated");
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("No token found");
    }

    const decodedData = jwt.verify(token, "HariBol");

    const { _id } = decodedData;
    if (!_id) {
      throw new Error("User not authenticated");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("User authentication failed " + error.message);
  }
};

module.exports = { adminAuth, userAuth };
