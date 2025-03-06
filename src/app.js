const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello I'm there!");
});
app.use("/", (req, res) => {
  res.send("Rahul Jha hello");
});
app.listen(3000, () => {
  console.log("server is on ");
});
