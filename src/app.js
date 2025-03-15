const express = require("express");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const cookiesParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const { authAdmin } = require("./midelware/auth");
app.use(express.json());
app.use(cookiesParser());
//SignUp User
app.post("/signup", async (req, res) => {
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
//Login User
app.post("/login", async (req, res) => {
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
//GET Profile user
app.get("/profile", authAdmin, async (req, res) => {
  const user = req.user;
  res.send(user);
});
app.post("/sendconnection", authAdmin, async (req, res) => {
  res.send("connection request sent");
});
//Feed API -GET /feed-> get all the user
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something wents wrong ");
  }
});
// GET user by emailId
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const userByEmail = await User.findOne({ emailId: emailId });
    if (!userByEmail) {
      res.status(401).send("user not found");
    } else {
      res.send(userByEmail);
    }
  } catch (err) {
    res.status(400).send("Something wents wrong");
  }
});
// delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Succefully ");
  } catch (err) {
    res.status(400).send("Update faild" + err.message);
  }
});
// update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["photoUrl", "skills", "age", "gender", "about"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATE.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("updated");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is on ");
    });
  })
  .catch((err) => {
    console.log("database not connected", err);
  });
