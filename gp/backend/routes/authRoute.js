const express = require('express');
const {
  signupValidator,
  loginValidator,
  updateValidator
} = require('../utils/validators/authValidator');
const {
  signup,
  login,
  getProfile,
  updateprofile
  // forgotPassword,
  // verifyPassResetCode,
  // resetPassword,
} = require('../services/authService');
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');

const router = express.Router();

router.post('/api/v1/auth/signup', signupValidator, signup);
router.post('/api/v1/auth/login', loginValidator, login);
router.get('/api/v1/auth/profile',verifytoken,allowedTo('USER'),getProfile)
router.put('/api/v1/auth/profile',verifytoken,allowedTo('USER'),updateValidator,updateprofile)
// router.post('/forgotPassword', forgotPassword);
// router.post('/verifyResetCode', verifyPassResetCode);
// router.put('/resetPassword', resetPassword);
module.exports = router;