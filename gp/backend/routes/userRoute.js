const express = require("express");
const {
deleteUserValidator,
} = require("../utils/validators/userValidator");
const {
getUsers,
deleteUser,
getProfile,
} = require("../services/userService");
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');

const router = express.Router();

router
  .route("/")
  .get(verifytoken,allowedTo('ADMIN','MANGER'),getUsers)
  

router
  .route("/:id")
  .delete(verifytoken,allowedTo('ADMIN','MANGER'),deleteUserValidator, deleteUser);
module.exports = router;
