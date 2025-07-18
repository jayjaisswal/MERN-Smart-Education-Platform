const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("DATABASE connected Successfully");
    })
    .catch((error) => {
      console.log("DATABASE connection error");
      console.error(error);
      process.exit(1);
    });
};
