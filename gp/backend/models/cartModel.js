const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(  {
    userId: {   
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        },
    products: [{
        productId: {
             type: mongoose.Schema.ObjectId,
            ref: "product",
            required: true,
        },
        productname:{
            type:String
        },
        productimage:{
            type:String
        },
     quantity: {
          type: Number, 
           default: 1,
        }, 
        productprice:{
            type: Number,
        }   
      },], 
      itemsPrice: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
     },
  { timestamps: true });
module.exports = mongoose.model("Cart", CartSchema);