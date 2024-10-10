const express = require("express");
const path = require("path");
const {
  getOneCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');

const router = express.Router();
// eslint-disable-next-line import/order
const multer = require('multer');

const diskstorage = multer.diskStorage({ 
    destination:(res,File,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,File,cb)=>{
        
        const ext = File.mimetype.split("/")[1]
        const filename = `Category-${Date.now()}.${ext}`
        cb(null, filename)
       
    }
})
const filefillter =(req,File,cb) => { //to allow sepcific type of file uploading
    const isimage = File.mimetype.split("/")[0]
        if(isimage ==="image"){
            return cb(null,true)
        }
        
            return cb("file must be image",false)
        
}
const upload = multer({ storage: diskstorage,fileFilter: filefillter})

router
  .route("/")
  .get(getCategories)
  .post(verifytoken,allowedTo('ADMIN'),upload.single("image"),createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getOneCategoryValidator, getOneCategory)
  .put(verifytoken,allowedTo('ADMIN'),upload.single("image"),updateCategoryValidator, updateCategory)
  .delete(verifytoken,allowedTo('ADMIN'),deleteCategoryValidator, deleteCategory);
module.exports = router;
