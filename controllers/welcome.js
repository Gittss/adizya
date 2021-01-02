const express = require("express");
const router = express.Router();
const { Product } = require("../models");

router.get("/", (req, res) => {
  Product.find({ purchased: { $gt: 1 } }, (err, products) => {
    if (!err) {
      res.render("welcome", {
        title: "Welcome",
        best: products,
      });
    }
  });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

module.exports = router;
