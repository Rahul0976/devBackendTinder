const express = require("express");
const userRouter = express.Router();
const { authAdmin } = require("../midelware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
userRouter.get("/user/request/received", authAdmin, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populated("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
      "about",
    ]);
    res.json({ message: "Data fatch Successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/user/connection", authAdmin, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populated("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "skills",
        "about",
      ])
      .populated("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "skills",
        "about",
      ]);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/feed", authAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit >= 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.fromUserId.toString());
    });
    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select("firstName lastName photoUrl age skills about")
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
