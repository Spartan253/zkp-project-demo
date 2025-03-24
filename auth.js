const jwt=require("jsonwebtoken");
require('dotenv').config();

exports.auth=async(req,res,next)=>{
try{
console.log("cookie",req.cookies.token);
console.log("body",req.body.token);
console.log("header",req.header("Authorization"));
const token=req.cookies.token|| req.body.token||req.header("Authorization")?.replace("Bearer","");
if(!token){
    return res.status(400).json({
        success:false,
        message:"invalid token"
    })
}

try{
    const decode=await jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode);
    req.user=decode;

}
catch(error){
    console.log(error);
    return res.status(401).json({
        success:false,
        message:"token invalid",
    })
}
next();
}
catch{
    return res.status(500).json({
        success:false,
        messaget:" something went wrong wentoken not present",
    })
}
}