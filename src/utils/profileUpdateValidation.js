const validator = require("validator");

const profileUpdateValidation = function (req) {
  const allowedFieldsToUpdate = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "address",
    "isMarried",
    "skills",
    "photoUrl",
  ];

  const userEnteredFields = Object.keys(req.body);

  const isUpdatingProfileValid = userEnteredFields.every((enteredFieldKey) => {
    return allowedFieldsToUpdate.includes(enteredFieldKey);
  });

  if (isUpdatingProfileValid) {
    userEnteredFields.forEach((key) => {
      console.log(key);

      switch (key) {
        case "email":
          if (!validator.isEmail(req.body[key])) {
            throw new Error("Invalid email address");
          }
          break;
        case "firstName":
        case "lastName":
          if (
            !validator.isAlpha(req.body[key]) ||
            !validator.isEmpty(req.body[key])
          ) {
            throw new Error("Provide valid name");
          }
          break;

        case "age":
          if (
            !validator.isInt(req.body[key], { min: 0, max: 120 }) ||
            !validator.isEmpty(req.body[key])
          ) {
            throw new Error("Provide valid age value");
          }
          break;
        case "gender":
          if (
            !validator.isAlpha(req.body[key]) ||
            !validator.isEmpty(req.body[key])
          ) {
            throw new Error("Provide valid gender");
          }
          break;
        case "address":
          if (
            !validator.isAlphanumeric(req.body[key], "en-US", {
              ignore: " @#_!$%^&*()-+=,.",
            }) ||
            !req.body[key].length > 250
          ) {
            throw new Error(
              "Address can only include alphanumeric and special characters and within 250 character limit"
            );
          }
          break;
        case "isMarried":
          if (typeof req.body[key] !== "boolean") {
            throw new Error("Select the valid field to set the marital data");
          }
          break;
        case "skills":
          if (!Array.isArray(req.body[key])) {
            throw new Error("Skills must be an array");
          }
          if (req.body[key].length > 10) {
            throw new Error("Skills should be less than 10");
          }
          break;

        case "photoUrl":
          if (
            !validator.isEmpty(req.body[key]) ||
            !validator.isURL(req.body[key])
          ) {
            throw new Error("Please provide valid url");
          }
      }
    });
  }
  return isUpdatingProfileValid;
};

module.exports = { profileUpdateValidation };
