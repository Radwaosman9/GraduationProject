const mongoose = require("mongoose");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const fs = require("fs");

// @desc   Get List Of Categories
// @route  GET  /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  // Pagination (from 10 - 12)
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  const categories = await CategoryModel.find();
  categories.map(categories=>[ categories.image= "http://localhost:8000/uploads/" + categories.image]);
    
  res.status(200).json( categories);
});

// @desc   Get Specific Category By ID
// @route  GET  /api/v1/categories/:id
// @access Public
exports.getOneCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    // res.status(404).json({ msg: "No Category For This ID!" });
    return next(new ApiError("No Category For This ID!", 404));
  }
  category.image= "http://localhost:8000/uploads/" + category.image;
  res.status(200).json({ data: category });
});

// @desc   Create Category
// @route  POST  /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const image = req.file.filename;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const category = await CategoryModel.create({...req.body,image});

  res.status(201).json({ data: category });
});

// @desc   Update Specific Category
// @route  PUT  /api/v1/categories/:id
// @access Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    return next(new ApiError("No Category For This ID!", 404));
  }

  if (req.file) {
    // File uploaded, update the image filename and delete the previous image
    const previousImagePath = "./uploads/" + category.image;
    if (fs.existsSync(previousImagePath)) {
      fs.unlinkSync(previousImagePath);
    }

    category.image = req.file.filename;
  }

  // Update other properties
  if (req.body.name) {

    category.slug = slugify(req.body.name);
  }
  category.name = req.body.name;
  // Save the updated category
  const updatedCategory = await category.save();

  if (updatedCategory.image) {
    updatedCategory.image = "http://localhost:8000/uploads/" + updatedCategory.image;
  }

  res.status(200).json({ data: updatedCategory });
});

// @desc   Delete Specific Category
// @route  DELETE  /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  let session = null;
  session = await mongoose.startSession();
  session.startTransaction();
  const { id } = req.params;
  const category = await CategoryModel.findOneAndDelete({ _id: id }).session(
    session
  );
  if (!category) {
    // res.status(404).json({ msg: "No Category For This ID!" });
    return next(new ApiError("No Category For This ID!", 404));
  }
  await ProductModel.deleteMany({ category: category._id }).session(session);
  await session.commitTransaction();
  session.endSession();
  res.status(200).json({ msg: "Deleted Successfully" });
});
