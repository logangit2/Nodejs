const mongoose = require("mongoose");
const express = require("express");
const app = express();

//model
const userModel = require("./models/userModel");

//middleware
app.use(express.json());

//mongoose connection
mongoose
  .connect("mongodb://localhost:27017/contactform")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/contact", async (req, res) => {
  let user = req.body;
  try {
    let contactSubmit = await userModel.create(user);
    console.log(contactSubmit);
    res.status(200).send({ message: "Contact form submitted" });
  } catch (err) {
    console.log(err);
  }
});

app.listen(8000, () => {
  console.log("server is on");
});
