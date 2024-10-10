const express = require("express");
const {
  getOneProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createReviewValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  getOneProduct,
  getallproductcategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  search,
  deleteReview,
} = require("../services/productService");
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
        const filename = `product-${Date.now()}.${ext}`
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

router.route("/").get(getProducts)
.post(verifytoken,allowedTo('ADMIN'),upload.single("image"),createProductValidator, createProduct);

router
  .route("/:id")
  .get(getOneProductValidator, getOneProduct)
  .put(verifytoken,allowedTo('ADMIN'),upload.single("image"),updateProductValidator, updateProduct)
  .delete(verifytoken,allowedTo('ADMIN'),deleteProductValidator, deleteProduct);

  router
  .route('/review')
  .post(verifytoken,allowedTo('USER'),createReviewValidator, addProductReview)

  router
  .route('/review/:id')
  .delete(verifytoken,allowedTo('USER'), deleteReview)
  

  router
  .route("/search/:key")
  .get(search);
  router
  .route("/getallproductcategory/:id")
  .get(getallproductcategory);
  
module.exports = router;