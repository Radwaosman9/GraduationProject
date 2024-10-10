const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const ReviewModel = require("../models/ReviewModel");
const ApiError = require("../utils/apiError");
const productModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const fs = require("fs");

// @desc   Get List Of Products
// @route  GET  /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Pagination (from 10 - 12)
  // const page = req.query.page * 1  1;
  // const limit = req.query.limit * 1  5;
  // const skip = (page - 1) * limit;
  const products = await ProductModel.find()
    // .skip(skip)
    // .limit(limit)
    .populate({ path: "category", select: "name -_id" });
    products.map(products=>[ products.image= "http://localhost:8000/uploads/" + products.image]);
  res.status(200).json(products);
});

// @desc   Get Specific Product By ID
// @route  GET  /api/v1/products/:id
// @access Public
exports.getOneProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id"
  }).populate({
    path: "Review",
    populate: {
      path: "User",
      select: "name"
    },
    select: ["Reviewtext", "User"]
  });
  
  if (!product) {
    // res.status(404).json({ msg: "No Product For This ID!" });
    return next(new ApiError("No Product For This ID!", 404));
  }
  product.image= "http://localhost:8000/uploads/" + product.image;
  res.status(200).json( product );
});

// @desc   Get Specific Product By ID
// @route  GET  /api/v1/products/:id
// @access Public
exports.getallproductcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the category document based on the categoryId
  const category = await CategoryModel.findById(id);

  if (!category) {
    return next(new ApiError("Category not found!", 404));
  }

  // Find products associated with the found category
  const products = await ProductModel.find({ category: id });

  // if (!products || products.length === 0) {
  //   return next(new ApiError("No products found for this category!", 404));
  // }

  // Adjust each product's image URL
  products.forEach(product => {
    product.image = "http://localhost:8000/uploads/" + product.image;
  });

  res.status(200).json(products);
});


// @desc   Create Product
// @route  POST  /api/v1/Products
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const image = req.file.filename;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const product = await ProductModel.create({...req.body,image});
  res.status(201).json({ data: product });
});

// @desc   Update Specific Product
// @route  PUT  /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return next(new ApiError("No product For This ID!", 404));
  }

  if (req.file) {
    // File uploaded, update the image filename and delete the previous image
    const previousImagePath = "./uploads/" + product.image;
    if (fs.existsSync(previousImagePath)) {
      fs.unlinkSync(previousImagePath);
    }

    product.image = req.file.filename;
  }

  // Update other properties
  if (req.body.name) {

    product.slug = slugify(req.body.name);
  }
  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;
  product.category =req.body.category;
  // Save the updated product
  const upadtedproduct = await product.save();

  if (upadtedproduct.image) {
    upadtedproduct.image = "http://localhost:8000/uploads/" + upadtedproduct.image;
  }

  res.status(200).json({ data: upadtedproduct });
});
// @desc   Delete Specific Product
// @route  DELETE  /api/v1/Products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findOneAndDelete({ _id: id });
  if (!product) {
    // res.status(404).json({ msg: "No Product For This ID!" });
    return next(new ApiError("No Product For This ID!", 404));
  }
  res.status(200).json({ msg: "Deleted Successfully" });
});

// @desc    Add product to FavList
// @route   POST /api/v1/FavList
// @access  Protected/User
exports.addProductReview = asyncHandler(async (req, res, next) => {
  // $addToSet => add productId to FavList array if productId not exist
  const product1 = await ProductModel.findById (req.body.product)
 if (!product1) { 
   res.status(404).json({message: 'product not found.'});}
else{
  const review = await ReviewModel.create(
    {
      Reviewtext: req.body.Reviewtext,
        product : req.body.product , 
        User: req.currentuser.id,
    },
  );
  
  await ProductModel.findByIdAndUpdate(
    req.body.product,
    { $push: { Review: review } }
  );

  const populatedReview = await ReviewModel.findById(review._id).populate('User', 'name');

  res.status(200).json({
    message: 'Review added successfully.',
    data: populatedReview,
  });


};
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.currentuser.id; // Assuming you have the current user's ID here

  // Find the review by its ID
  const review = await ReviewModel.findById(id);

  // Check if the review exists
  if (!review) {
    return res.status(404).json({ msg: "No Review For This ID!" });
  }

  // Check if the current user is the author of the review
  if (review.User.toString() !== userId) {
    return res.status(403).json({ msg: "You are not authorized to delete this review!" });
  }

  // If the current user is the author, proceed to delete the review
  await ReviewModel.findByIdAndDelete(id);

  res.status(200).json({ msg: "Deleted Successfully" });
});

// @desc   search Product By name
// @route  GET  /api/v1/products/:key
// @access Public
exports.search = asyncHandler(async (req, res, next) => {
  req.params.key = req.params.key.toLowerCase().trim().replaceAll(" ", "-") ;
   const searchresult = await ProductModel.find({"$or":[{slug:{$regex:req.params.key}}]});
   if (searchresult.length === 0) {
     res.status(404).json({ msg: "No Product founded !" });
   }
   else{
    const formattedResults = searchresult.map(product => ({
      id:product._id,
      image: `http://localhost:8000/uploads/${product.image}`, // Adjust 'imageName' field accordingly
      name: product.name,
      description: product.description,
      price: product.price
    }));
     res.status(200).json( formattedResults );}
 });