// The purpose of this code is to connect to a MongoDB database using the Mongoose library. It also provides error handling in case the connection fails.

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = connectDB;
