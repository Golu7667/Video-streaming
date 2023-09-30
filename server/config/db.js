const mongoose=require("mongoose")

const connetDatabase=()=>{
   mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true ,w: 'majority' })
   .then(()=>{
    console.log("connected mongodb")
   }).catch((err)=>{
    console.log(err)
   })
}
module.exports=connetDatabase;