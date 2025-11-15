const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (
    !firstName ||
    !lastName ||
    !validator.isAlpha(firstName) ||
    !validator.isAlpha(lastName)
  ) {
    throw new Error("Please provide valid name");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please provide valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = { validateSignupData };
