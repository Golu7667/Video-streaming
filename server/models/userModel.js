const mongoose=require("mongoose")


const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},

},
{ timestaps: true })

userSchema.pre('save', function (next) {
    this.name = this.name.toLowerCase();
    this.email = this.email.toLowerCase()
    next();
  });



const User=mongoose.model("User",userSchema)
module.exports=User;