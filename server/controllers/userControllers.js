const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const userData = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  console.log(email, name, req.body);
  if (!email || !name) {
    res.status(400);
    throw new Error("Please enter all feilds");
  }

  const userExits = await User.findOne({ email });
   console.log(userExits)
  if (userExits) {
    const user=await User.findOne({email})
    
    res.status(201).json({
      _id:user._id,
      email: user.email,
      name:user.name,
    });
    

  } else {
    const user = await User.create({
      name: name,
      email: email,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    } else {
      res.status(400).json({message:"Not join"});
      throw new Error("user not save in database");
    }
  }
});

module.exports = { userData };
