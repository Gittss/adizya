const mongoose = require("mongoose");
var fs = require("fs");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dresscode: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ["X-Small", "Small", "Medium", "Large", "X-Large"],
    default: "Medium",
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
