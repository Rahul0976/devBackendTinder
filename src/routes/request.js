const express = require("express");
const { authAdmin } = require("../midelware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
requestRouter.post(
  "/request/send/:status/:toUserId",
  authAdmin,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignore", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Staus:" + status);
      }
      const connectionRequestAllreadyExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionRequestAllreadyExist) {
        throw new Error("Connection Request allready Exist");
      }
      const isToUserIdPresent = await User.findById(toUserId);
      if (!isToUserIdPresent) {
        throw new Error("User is Not Present");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + isToUserIdPresent,
        data,
      });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);
module.exports = requestRouter;
