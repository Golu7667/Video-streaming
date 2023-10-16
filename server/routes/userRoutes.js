const express=require("express")
const {userData}=require("../controllers/userControllers")
const router=express.Router()

router.route("/").post(userData)   

module.exports=router; 