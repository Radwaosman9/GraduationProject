const express = require("express");

const {
    addtocart,
    removeFromCart,
    getmycart,
    increaseQuantity,
    decreaseQuantity,
    payment,
    getUserHistory,
    getHistory,
    clearCart
  
} = require("../services/cartService");
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');

const router = express.Router();

router
  .route("/")
  .get(verifytoken,allowedTo('USER'),getmycart)
  
  router
  .route("/myhistory")
  .get(verifytoken,allowedTo('USER'),getUserHistory)

  router
  .route("/history")
  .get(verifytoken,allowedTo('ADMIN'),getHistory)
  
router
  .route("/")
  .post(verifytoken,allowedTo('USER'), addtocart);

  router
  .route("/payment")
  .post(verifytoken,allowedTo('USER'), payment);
router
  .route("/:id")
  .delete(verifytoken,allowedTo('USER'), removeFromCart);

  router
  .route("/increase/:id")
  .put(verifytoken,allowedTo('USER'), increaseQuantity);

  router
  .route("/decrease/:id")
  .put(verifytoken,allowedTo('USER'), decreaseQuantity);

  router
  .route("/")
  .put(verifytoken,allowedTo('USER'), clearCart);
  
//   router
//   .route("/:id/pay")
//   .put(verifytoken,allowedTo('USER'), payment);
module.exports = router;