const mongoose = require("mongoose");

//1- Create Schema
const infoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Information name Required"],
      unique: [true, "Information name Unique"],
      minlength: [3, "to short information name"],
      maxlength: [32, "to long information name"],
    },
    information: {
        type: String,
        required: [true, "Information  Required"],
        minlength: [3, "too short information"],
        // maxlength: [255, "too long information"],
      },
      image: String,
     // A and B => shoping.com/a-and-b
     slug: {
        type: String,
        lowercase: true,
      }
  },
  { timestamps: true }
);

//2- Create Model
const infoModel = mongoose.model("info", infoSchema);

module.exports = infoModel;
