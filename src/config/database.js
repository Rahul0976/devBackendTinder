const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://new_1:a3uc0GbIn85Gq7q4@cluster0.warhg.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
