const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);
    //encrypt the password
    const { password, firstName, lastName, age, emailId, gender, skills } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      skills,
      password: passwordHash,
    });
    if (user.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }
    await user.save();
    res.send("user added succefully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isPasswordValid = await user.validateUser(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send("Login successful!!");
      } else {
        throw new Error("Invalid credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout succesfull");
});
module.exports = authRouter;
