const authAdmin = (req, res, next) => {
  const token = "xyz";
  const isTokenValid = token === "xyz";
  if (!isTokenValid) {
    res.status(401).send("admin is invalid");
  } else {
    next();
  }
};
module.exports = {
  authAdmin,
};
