const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Review must belong to a user"],
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true,
        },
        productname: {
          type: String,
          // required: true,
        },
        quantity: {
          type: Number,
          // required: true,
        },
        productprice: {
          type: Number,
          // required: true,
        }
      }
    ],
    totalPrice: {
      type: Number,
      // required: true,
    },
    date: { type: Date, default: Date.now }
  }
);
const History = mongoose.model('History', HistorySchema);
module.exports = History;