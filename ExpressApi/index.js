const express = require("express");

const app = express();

// app.use(express.json());
app.listen(8000, () => {
  console.log("server running");
});

app.get("/products", (req, res) => {
  console.log("get request incoming");
  res.send({ message: "get response" });
});

app.post("/products", express.json(), (req, res) => {
  res.send(req.body);
});

// app.get("/users/:id", middleMan, (req, res) => {
//   console.log(req.params.id);
//   res.send({ message: "user response recived" });
// });

// function middleMan(req, res, next) {
//   if (req.params.id < 10) {
//     res.send({ message: "req is blocked" });
//   } else {
//     next();
//   }
// }
