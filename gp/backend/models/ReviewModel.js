const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    Reviewtext: {
      type: String,
      trim: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: [true, "review  Must Be Belong To product"],
      },
      User: 
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, "review  Must Be Belong To user"],
        },
      

  });
    
    const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;