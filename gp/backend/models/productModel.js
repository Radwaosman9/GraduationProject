const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too Short Product Title"],
      maxlength: [100, "Too Long Product Title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description Is Required"],
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [200000, "Too Long Product Price"],
    },
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product Must Be Belong To Category"],
    },
    Review: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
        required: [true, "Product Must Be Belong To Review"],
      },
    ],
  },
  { timestamps: true }
);

const productModel= mongoose.model("Product", productSchema);
module.exports = productModel;
