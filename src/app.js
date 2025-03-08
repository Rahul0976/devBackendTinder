const express = require("express");
const app = express();
const { authAdmin } = require("./midelware/auth");
app.use("/admin", authAdmin);
app.use("/admin/getdata", (req, res) => {
  res.send("succesfull");
});
app.use("/admin/deletedata", (req, res) => {
  res.send("succesfull delete");
});
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
