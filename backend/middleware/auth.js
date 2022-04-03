const catchAsyncErrors=require("./catchasyncerror");
const JWT=require("jsonwebtoken");
const User=require("../model/usermodel");
const Errorhandler=require("../utils/errorhandler");

exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
    {
        return next(new Errorhandler("please login to access this resouces",401))
    }
    const decodedData=JWT.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decodedData.id)
    next()
});
exports.authorizeRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(new Errorhandler('Role:${req.user.role} is not allowed to access this resouces',403));
        }
        next();
    }
}