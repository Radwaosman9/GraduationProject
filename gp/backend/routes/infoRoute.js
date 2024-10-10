const express = require("express");
const {
 getOneInfoValidator,
 createInfoValidator,
 updateInfoValidator,
 deleteInfoValidator,
} = require("../utils/validators/infoValidator");
const {
getInformations,
getOneInformation,
createInformation,
updateInformation,
deleteInformation,
getonlytwo,
} = require("../services/infoService");
const verifytoken =require('../middleware/Authirzation');
const allowedTo =require('../middleware/allowedTo');
// const auth = require("../services/authService");
const router = express.Router();
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const multer = require('multer');

const diskstorage = multer.diskStorage({ 
    destination:(res,File,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,File,cb)=>{
        
        const ext = File.mimetype.split("/")[1]
        const filename = `info-${Date.now()}.${ext}`
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
  .get(getInformations)
  .post(verifytoken,allowedTo('ADMIN'),upload.single("image"),createInfoValidator, createInformation);

  router
  .route("/getonlytwo")
  .get(getonlytwo)

router
  .route("/:id")
  .get(getOneInfoValidator, getOneInformation)
  .put(verifytoken,allowedTo('ADMIN'),upload.single("image"),updateInfoValidator, updateInformation)
  .delete(verifytoken,allowedTo('ADMIN'),deleteInfoValidator, deleteInformation);
module.exports = router;
