const express = require("express");
const connectDB = require("./config/database");
const cookiesParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
