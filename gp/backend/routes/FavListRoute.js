const express = require('express');

const authService = require('../services/authService');

const {
  addProductToFavList,
  removeProductFromFavList,
  getUserFavList,
} = require('../services/FavListService');
const verifytoken = require('../middleware/Authirzation');
const allowedTo = require('../middleware/allowedTo');

const router = express.Router();

router
.route('/')
.get(verifytoken,allowedTo('USER'),getUserFavList)
.post(verifytoken,allowedTo('USER'),addProductToFavList)

router
.route("/:productId")
.delete(verifytoken,allowedTo('USER'), removeProductFromFavList);

module.exports = router;