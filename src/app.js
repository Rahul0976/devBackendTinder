const express = require("express");
const app = express();
// admin Authentication
const { authAdmin } = require("./midelware/auth");
app.use("/admin", authAdmin);
app.use("/admin/getdata", (req, res) => {
  res.send("succesfull");
});
//intensnally creating error
app.use("/admin/deletedata", (req) => {
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
//Error Handle
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(404).send("Somthing geting wrong contact support team");
  }
});

app.listen(3000, () => {
  console.log("server is on ");
});
