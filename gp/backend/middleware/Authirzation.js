const jwt = require('jsonwebtoken');
const verifytoken =async (req,res,next) =>{
    const header = req.headers['authorization']||req.headers['Authorization'];
    if(!header){
        return res.status(401).json({msg:"token is required!"})
    }
    const token = header.split(' ')[1];
    try{
        const currentuser=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.currentuser = currentuser;
        // res.locals.currentuser = currentuser;
        next();
    }
    catch(err){
        return res.status(401).json({ msg:err.message});
    }
}

module.exports= verifytoken