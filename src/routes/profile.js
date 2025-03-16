const express = require("express");
const { authAdmin } = require("../midelware/auth");
const { validateUserProfileData } = require("../utils/validation");
const profileRouter = express.Router();
profileRouter.get("/profile/view", authAdmin, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", authAdmin, async (req, res) => {
  try {
    if (!validateUserProfileData(req)) {
      throw new Error("Inavlaid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile was edit succesfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = profileRouter;
