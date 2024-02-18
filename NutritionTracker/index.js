//Nutrify

const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

//importing models
const userModel = require("./models/model");
const trakingModel = require("./models/trackingModel");
const foodModel = require("./models/foodModel");

// connecting to DB using mongoose
mongoose.connect("mongodb://localhost:27017/nutrify").then(() => {
  console.log("Database connected");
});

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//user register
app.post("/register", (req, res) => {
  let user = req.body;
  //bcrypt password
  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (!err) {
          user.password = hpass;
          try {
            let doc = await userModel.create(user);
            res.status(201).send({ message: "post successfull" });
          } catch (err) {
            console.log(err);
            res.status(500).send({ message: "some problem" });
          }
        }
      });
    }
  });
});

//user login
app.post("/login", async (req, res) => {
  let user = req.body;
  try {
    let logUser = await userModel.findOne({
      email: user.email,
    });
    if (logUser !== null) {
      //compare password
      bcrypt.compare(user.password, logUser.password, (err, success) => {
        if (success === true) {
          //generating jwt token
          jwt.sign({ email: user.email }, "logankey", (err, token) => {
            if (!err) {
              res.status(200).send({
                token: token,
                message: "Login-Success",
                type: "success",
                name: logUser.name,
                userid: logUser._id,
              });
            }
          });
        } else {
          console.log(err);
          res.status(404).send({ message: "wrong password", type: "wrong" });
        }
      });
    } else {
      console.log("wrong email");
      res.status(400).send({ message: "check your email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "failed" });
  }
});

//fectching food data
app.get("/food/:name", verifyToken, async (req, res) => {
  try {
    let foodData = await foodModel.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (foodData.length !== 0) {
      res.send(foodData);
    } else {
      res.send({ message: "no food found" });
    }
  } catch (err) {
    console.log(err);
  }
});

//tracking food
app.post("/track", verifyToken, async (req, res) => {
  let trackData = req.body;
  try {
    let trackFood = await trakingModel.create(trackData);
    res.send({ message: "Food added" });
  } catch (err) {
    console.log(err);
  }
});

//verify token
function verifyToken(req, res, next) {
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "logankey", (err, res) => {
    if (!err) {
    //  console.log(" token verified");
      next();
    } else {
      console.log("no token found or wrong token");
      res.send({ message: "some problem or Wrong token" });
    }
  });
}

//fetching foods eaten by a person

app.get("/track/:userid/:date", verifyToken, async (req, res) => {
  let userId = req.params.userid;
  let eatenDate = req.params.date;
  try {
    let foods = await trakingModel
      .find({ userid: userId, eatenDate: eatenDate })
      .populate("userid")
      .populate("foodid");
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.send({ message: "some problem" });
  }
});

app.listen(8000, () => {
  console.log("Server running");
});
