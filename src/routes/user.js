const express = require("express");
const userRouter = express.Router();
const { authAdmin } = require("../midelware/auth");
const ConnectionRequest = require("../models/connectionRequest");
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
