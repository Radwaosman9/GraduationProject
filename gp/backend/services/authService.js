// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bycrpt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');



const User = require('../models/UserModel');


exports.signup = asyncHandler(async (req, res, next) => {
  const { password} = req.body;
  const cryptopassword = await bycrpt.hash(password,8)
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    address: req.body.address,
    birthday: req.body.birthday,
    password: cryptopassword,
  
  });
  // const token  = await jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET_KEY,{expiresIn:"3d"}) 
  // user.token = token;
  res.status(201).json({ data: user});
});


//Login
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bycrpt.compare(req.body.password, user.password))) {
    
      return res.status(401).json({ message: "Incorrect email or password." });

  }
  // 3) generate token
  const token = await jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET_KEY,{expiresIn:"3d"})
user.token = token;
  // Delete password from response ??
 // delete user._doc.password;
  // 4) send response to client side
  res.status(200).json(user);
});

// @desc  get my profile
// @route  DELETE  /api/v1/users/:id
// @access ADMIN , user

exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById( req.currentuser.id);

  res.status(200).json( user
  );
});

// @desc   Update Specific profile
// @route  PUT  /api/v1/auth/profile
// @access Private
exports.updateprofile = asyncHandler(async (req, res, next) => {
  // const cryptopassword = await bycrpt.hash(req.body.password,8)
  try {
    // Extract updated profile information from FormData
    const { name, address, phone } = req.body;

  const profile = await User.findById(req.currentuser.id );
  if (name) profile.name = name;
    // if (email) profile.email = email;
    if (address) profile.address = address;
    if (phone) profile.phone = phone;
    await profile.save();

  res.status(200).json(profile);
} catch (error) {
  // Handle errors
  console.error(error);
  res.status(500).json({  message: 'Failed to update profile' });
}
});