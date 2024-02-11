const http = require("http");
const fs = require("fs");
const url = require("url");

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let products = fs.readFileSync("./products.json", "utf-8");

    let parsedurl = url.parse(req.url, true);
    // console.log(parsedurl);

    if (
      parsedurl.pathname == "/products" &&
      req.method == "GET" &&
      parsedurl.query.id == undefined
    ) {
      res.end(products);
      //   console.log(parsedurl.query.id);
      //   console.log(products);
    } else if (
      parsedurl.pathname == "/products" &&
      req.method == "GET" &&
      parsedurl.query.id !== undefined
    ) {
      let parsedProduct = JSON.parse(products);
      let idProduct = parsedProduct.find((product) => {
        return product.id == parsedurl.query.id;
      });
      if (idProduct != undefined) {
        res.end(JSON.stringify(idProduct));
      } else
        res.end(JSON.stringify({ message: "No products found check the ID" }));
      console.log(idProduct);
    }
  })
  .listen(8000);
