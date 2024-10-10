const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    address: String,
    birthday: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['USER', 'MANGER', 'ADMIN'],
      default: 'USER',
    },
    token:{
      type: String
  },  
    avtar:{
    type : String,
    default: "http://localhost:8000/uploads/profile_pic.jpg"
},
  FavList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
}
  );
    const User = mongoose.model('User', UserSchema);

module.exports = User;