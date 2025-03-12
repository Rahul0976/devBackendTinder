const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  // creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added succefully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
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
    console.log("database not connected");
  });
