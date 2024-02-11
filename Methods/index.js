const http = require("http");
const fs = require("fs");
const url = require("url");

// http
//   .createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);
//     let productFile = fs.readFileSync("./products.json", "utf-8");
//     // console.log(parsedUrl);
//     if (parsedUrl.pathname == "/products" && req.method == "GET") {
//       res.end("link is correct");
//     } else if (parsedUrl.pathname == "/products" && req.method == "POST") {
//       let products = "";
//       req.on("data", (chunk) => {
//         // console.log(chunk);
//         products = products + chunk;
//       });
//       req.on("end", () => {
//         // console.log(products);
//         let productArray = JSON.parse(productFile);
//         let newProduct = JSON.parse(products);
//         productArray.push(newProduct);

//         fs.writeFileSync("./products.json", JSON.stringify(productArray));
//       });
//       res.end("new file created ");
//     }
//   })
//   .listen(8000);

http
  .createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let productFile = fs.readFileSync("./products.json", "utf-8");
    // console.log(parsedUrl);

    if (parsedUrl.pathname == "/products" && req.method == "POST") {
      let product = "";
      req.on("data", (chunk) => {
        product = product + chunk;
      });

      req.on("end", () => {
        let productArray = JSON.parse(productFile);
        let newProduct = JSON.parse(product);

        productArray.push(newProduct);

        fs.writeFileSync("./products.json", JSON.stringify(productArray));
      });
      res.end("Post successfull");
    } else if (parsedUrl.pathname == "/products" && req.method == "DELETE") {
      let parsedFile = JSON.parse(productFile);

      let selectedIndex = parsedFile.findIndex((product) => {
        return parsedUrl.query.id == product.id;
      });

      parsedFile.splice(selectedIndex, 1);
      fs.writeFileSync("./products.json", JSON.stringify(parsedFile));
      res.end("Deleted ");
    } else if (parsedUrl.pathname == "/products" && req.method == "PUT") {
      let dataa = "";
      req.on("data", (chunk) => {
        dataa = dataa + chunk;
      });

      req.on("end", () => {
        let parsedFile = JSON.parse(productFile);
        let newData = JSON.parse(dataa);

        // let index = parsedFile.findIndex((product) => {
        //   return product.id == parsedUrl.query.id;
        // });

        let index = parsedFile.findIndex((indexx) => {
          return indexx.id == parsedUrl.query.id;
        });
        parsedFile[index] = newData;

        fs.writeFileSync("./products.json", JSON.stringify(parsedFile));
      });
      res.end("Updated");
    }
  })
  .listen(8000);
