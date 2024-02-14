const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://localhost:27017/apidev")
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

//Registration.........................

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  let user = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, (err, hpass) => {
        if (!err) {
          user.password = hpass;
          userModel
            .create(user)
            .then((doc) => {
              res.send({ message: "User registration successfull" });
            })
            .catch((err) => {
              console.log(err);
              res.send({ message: "Some problem" });
            });
        }
      });
    } else {
      res.send({ message: "Some problem" });
    }
  });
});

//login......................

app.post("/login", (req, res) => {
  let userCred = req.body;

  userModel
    .findOne({ email: userCred.email })
    .then((user) => {
      if (user !== null) {
        bcrypt.compare(userCred.password, user.password, (err, result) => {
          if (result === true) {
            // genarate web token
            jwt.sign({ email: userCred.email }, "logankey", (err, token) => {
              if (!err) {
                res.send({ token: token });
              } else {
                res.send({ message: "Some issue " });
              }
            });
          } else {
            res.send({ message: "incorrect password" });
          }
        });
      } else {
        res.send({ message: "wrong email" });
      }
    })
    .catch((err) => {
      res.send({ message: "Some problem" });
    });
});

app.get("/getdata", verifyToken, (req, res) => {
  userModel.findOne({ name: "logan" }).then((data) => {
    console.log(data);
    res.send({ message: "data received" });
  });
});

//Verify token
function verifyToken(req, res, next) {
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "logankey", (err, data) => {
    if (!err) {
      console.log(data);
      next();
    } else {
      console.log(err);
      res.send({ message: "Invalid token" });
    }
  });
}

app.listen(8000, () => {
  console.log("server is running");
});
