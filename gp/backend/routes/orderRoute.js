const express = require("express");

const {
    getmyorder,
    createorder,
    getonlyone,
    payment,
} = require("../services/orderService");
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');

const router = express.Router();

router
  .route("/myorder")
  .get(verifytoken,allowedTo('USER'),getmyorder)
  

router
  .route("/")
  .post(verifytoken,allowedTo('USER'), createorder);
  router
  .route("/:id")
  .get(verifytoken,allowedTo('USER'), getonlyone);
  router
  .route("/:id/pay")
  .put(verifytoken,allowedTo('USER'), payment);
module.exports = router;
