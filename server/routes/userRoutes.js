const express=require("express")
const {userData}=require("../controllers/userControllers")
const {allUserData}=require("../controllers/AlluserControllers")
const router=express.Router()

router.route("/").post(userData)   
router.route("/users").get(allUserData) 

module.exports=router; 