const express = require("express");
const app = express();
//this will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "Rahul", lastName: "Jha" });
});
app.post("/user", (req, res) => {
  res.send("Data successfully saved to the Database");
});
app.delete("/user", (req, res) => {
  res.send("Deleted Succesfully");
});
//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello I'm there!");
});

app.listen(3000, () => {
  console.log("server is on ");
});
