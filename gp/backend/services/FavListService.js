const asyncHandler = require('express-async-handler');

const User = require('../models/UserModel');

// @desc    Add product to FavList
// @route   POST /api/v1/FavList
// @access  Protected/User
exports.addProductToFavList = asyncHandler(async (req, res, next) => {
    // $addToSet => add productId to FavList array if productId not exist
    const user = await User.findByIdAndUpdate(
        req.currentuser.id,
      {
        $addToSet: { FavList: req.body.productId },
      },
      { new: true }
    );
  
    res.status(200).json({
      status: 'success',
      message: 'Product added successfully to your FavList.',
      data: user,
    });
  });

// @desc    Remove product from FavList
// @route   DELETE /api/v1/FavList/:productId
// @access  Protected/User
exports.removeProductFromFavList = asyncHandler(async (req, res, next) => {
  // $pull => remove productId from FavList array if productId exist
  const user = await User.findByIdAndUpdate(
    req.currentuser.id,
    {
      $pull: { FavList: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: 'Product removed successfully from your FavList.',
  });
});

// @desc    Get logged user FavList
// @route   GET /api/v1/FavList
// @access  Protected/User
exports.getUserFavList = asyncHandler(async (req, res, next) => {
    const user = await User.findById( req.currentuser.id).populate('FavList');
  
    res.status(200).json(
user.FavList,
    );
  });