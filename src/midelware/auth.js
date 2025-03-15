const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authAdmin = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is Not Valid");
    }
    const DecodedMessage = await jwt.verify(token, "WEBDEV@Tinder$098");
    const { _id } = DecodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user is not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
module.exports = {
  authAdmin,
};
