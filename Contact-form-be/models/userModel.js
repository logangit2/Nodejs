const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email id required"],
  },
  phone: {
    type: Number,
  },
  message: {
    type: String,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
