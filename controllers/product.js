const router = require("express").Router();
const Product = require("../models/product");
const util = require("../config/utilityFunctions");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("products", { title: "Our Products" });
});

router.get("/add:id", (req, res) => {
  res.render("addProduct", {
    title: "Add Product",
    vendorId: req.params.id,
  });
});

router.post("/add:id", upload.single("file"), (req, res) => {
  if (req.body.id == "") {
    var product = new Product(req.body);
    product.image.data = fs.readFileSync(
      path.join("D:/Minor/public/img/uploads/" + req.file.filename)
    );
    product.image.name = "D:/Minor/public/img/uploads/" + req.file.filename;
    product.image.contentType = "image/png";
    product.vendorId = req.params.id;
    product.save((err) => {
      if (!err) {
        res.redirect("/product/viewProducts" + product.vendorId);
      } else {
        if (err.name == "ValidationError") {
          util.handleValidationError(err, req.body);
          console.log(err);
          res.render("addProduct", {
            title: "Add Product",
            vendorId: req.params.id,
            product: req.body,
          });
        }
      }
    });
  } else {
    Product.findById(req.body.id, (err, product) => {
      if (!err) {
        product.name = req.body.name;
        product.dresscode = req.body.dresscode;
        product.size = req.body.size;
        product.price = req.body.price;
        Product.findByIdAndUpdate(req.params.id, product, (err) => {
          if (!err) {
            product.save((err) => {
              if (!err) {
                res.redirect("/product/viewProducts" + product.vendorId);
              } else {
                if (err.name == "ValidationError") {
                  util.handleValidationError(err, req.body);
                  res.render("addProduct", {
                    title: "Update Product",
                    vendorId: req.params.id,
                    product: req.body,
                  });
                }
              }
            });
          }
        });
      } else {
        console.log(err);
        res.redirect("back");
      }
    });
  }
});

router.get("/viewProducts:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    Product.find({ vendorId: req.params.id }, (err, products) => {
      if (!err) {
        res.render("viewProducts", {
          title: "Your products",
          name: doc.name,
          uid: doc.id,
          products: products,
          role: 1,
          cart: 0,
        });
      } else {
        console.log(err);
        res.redirect("back");
      }
    });
  });
});

router.get("/getImage/:id", (req, res) => {
  Product.findById(req.params.id, (err, doc) => {
    res.contentType(doc.image.contentType);
    res.send(doc.image.data);
  });
});

router.get("/view:id", (req, res) => {
  Product.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("viewProduct", {
        title: "Product page",
        product: doc,
      });
    } else {
      res.redirect("back");
    }
  });
});

router.get("/viewAllProducts", (req, res) => {
  res.render("products", {
    title: "Our Products",
  });
});

router.get("/update:id", (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (!err) {
      res.render("addProduct", {
        title: "Update Product",
        product: product,
        vendorId: product.vendorId,
      });
    }
  });
});

router.get("/delete:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/product/viewProducts" + doc.vendorId);
    }
  });
});

module.exports = router;
