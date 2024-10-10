const asyncHandler = require("express-async-handler");
const userModel = require("../models/UserModel");
const ApiError = require("../utils/apiError");


// @desc   Get List Of users
// @route  GET  /api/v1/users
// @access ADMIN ,MANGER
exports.getUsers = asyncHandler(async (req, res) => {
  // Pagination (from 10 - 12)
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const users = await userModel.find({},{"password":false ,"token":false})
    .skip(skip)
    .limit(limit)
  res.status(200).json({ results: users.length, page, data: users });
});

// @desc   block Specific user
// @route  DELETE  /api/v1/users/:id
// @access ADMIN , MANGER
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOneAndDelete({ "_id" : id });
  if (!user) {
    // res.status(404).json({ msg: "No Product For This ID!" });
    return next(new ApiError("No User For This ID!", 404));
  }
  res.status(200).json({ msg: "Blocked User Successfully" });
});


