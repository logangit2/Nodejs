const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/apidev")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 20,
    max: 100,
  },
});

const userModel = mongoose.model("users", userSchema);

const user = {
  name: "Logan",
  age: 25,
};

userModel
  .create(user)
  .then(() => {
    console.log("data inderted");
  })
  .catch((err) => {
    console.log(err);
  });
