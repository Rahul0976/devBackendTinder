const express = require("express");
const { authAdmin } = require("../midelware/auth");
const requestRouter = express.Router();
requestRouter.post("/sendconnection", authAdmin, async (req, res) => {
  const user = req.user;
  res.send("connection request sent");
});
module.exports = requestRouter;
