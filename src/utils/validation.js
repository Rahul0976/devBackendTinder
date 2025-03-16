const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong Password ");
  }
};
const validateUserProfileData = (req) => {
  const allowedUpdatedData = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "gender",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedUpdatedData.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateUserProfileData,
};
