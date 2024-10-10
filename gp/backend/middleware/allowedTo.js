module.exports = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.currentuser.role)){
            return next(res.status(401).json("you are not allowed to access this!"));
        }
        next();
    }
}
