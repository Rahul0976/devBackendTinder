const express = require("express");
const app = express();
app.use(
  "/user",
  (req, res, next) => {
    //request Handler
    console.log("first");
    next();
  },
  (req, res) => {
    console.log("second");
    res.send("second res");
  }
);

app.listen(3000, () => {
  console.log("server is on ");
});
