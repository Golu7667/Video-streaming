const User =require("../models/userModel")
const asyncHandler=require("express-async-handler")


const allUserData=asyncHandler(async(req,res,next)=>{
  
    const user=await User.find({})
    console.log(user)

    res.send(user)

})


module.exports={allUserData}