const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const infoModel = require("../models/infoModel");
const ApiError = require("../utils/apiError");
const fs = require("fs");

// @desc   Get List Of infromations
// @route  GET  /api/v1/informtions
// @access Public
exports.getInformations = asyncHandler(async (req, res) => {
  // Pagination (from 10 - 12)
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  const informations = await infoModel.find()
    // .skip(skip)
    // .limit(limit)
  informations.map(informations=>[ informations.image= "http://localhost:8000/uploads/" + informations.image])
  res.status(200).json(  informations );
});

// @desc   Get Specific info By ID
// @route  GET  /api/v1/Informations/:id
// @access Public
exports.getOneInformation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Information = await infoModel.findById(id);
  if (!Information) {
    // res.status(404).json({ msg: "No Product For This ID!" });
    return next(new ApiError("No Information For This ID!", 404));
  }
  Information.image= "http://localhost:8000/uploads/" + Information.image;
  res.status(200).json({ data: Information });
});

// @desc   Create Product
// @route  POST  /api/v1/Informations
// @access Private
exports.createInformation = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  // const information = req.body.information;
  const image = req.file.filename;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const Information = await infoModel.create({...req.body,image});
  res.status(201).json({ data: Information });
});

// @desc   Update Specific info
// @route  PUT  /api/v1/Informations/:id
// @access Private
exports.updateInformation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const info = await infoModel.findById(id);

  if (!info) {
    return next(new ApiError("No information For This ID!", 404));
  }

  if (req.file) {
    // File uploaded, update the image filename and delete the previous image
    const previousImagePath = "./uploads/" + info.image;
    if (fs.existsSync(previousImagePath)) {
      fs.unlinkSync(previousImagePath);
    }

    info.image = req.file.filename;
  }

  // Update other properties
  if (req.body.name) {
    info.slug = slugify(req.body.name);
  }
info.name =req.body.name;
info.information = req.body.information;
  // Save the updated category
  const updatedinfo = await info.save();

  if (updatedinfo.image) {
    updatedinfo.image = "http://localhost:8000/uploads/" + updatedinfo.image;
  }

  res.status(200).json({ data: updatedinfo });
});

// @desc   Delete Specific info
// @route  DELETE  /api/v1/Informations/:id
// @access Private
exports.deleteInformation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Information = await infoModel.findOneAndDelete({ "_id" : id });
  if (!Information) {
    // res.status(404).json({ msg: "No Product For This ID!" });
    return next(new ApiError("No Information For This ID!", 404));
  }
  res.status(200).json({ msg: "Deleted Successfully" });
});




exports.getonlytwo = asyncHandler(async (req, res) => {
  const informations = await infoModel.find().limit(2);
    // .skip(skip)
    // .limit(limit)
  informations.map(informations=>[ informations.image= "http://localhost:8000/uploads/" + informations.image])
  res.status(200).json(  informations );
});