var PORT = process.env.PORT || 3000;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphand = require("express-handlebars");
const bodyparser = require("body-parser");
const controllers = require("./controllers");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphand({
    extname: "hbs",
    defaultLayout: "mainlayout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use("/", express.static(__dirname + "/public"));

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true },
  (err) => {
    if (!err) console.log("MongoDb connected");
    else console.log(err);
  }
);

app.listen(PORT, () => {
  console.log("express server started at " + PORT);
});

app.use("/", controllers.welcomeController);
app.use("/account", controllers.accountController);
app.use("/product", controllers.productController);
app.use("/cart", controllers.cartController);
app.use("/contact", controllers.contactController);
